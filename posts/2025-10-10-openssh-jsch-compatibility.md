---
title: 'Amazon Linux 2023とJDK 1.7のJSCH間でSFTP接続が失敗した原因と対策'
date: '2025-10-10'
description: 'NextEngineのカスタムデータ作成からのSFTPアップロードがOpenSSH 8.7で失敗した問題を調査し、JSCH-0.1.54のレガシーアルゴリズムサポート不足が原因であることを特定。限定的なセキュリティダウングレードで解決した経緯をまとめる。'
tags: [ 'SSH', 'SFTP', 'OpenSSH', 'JSCH', 'Amazon Linux', 'セキュリティ' ]
---

## きっかけ

PHP 7からPHP 8.4へのアップグレードに伴い、サーバーをAmazon Linux 2023へ移行した。
この際、NextEngineのカスタムデータ作成からのSFTPファイルアップロードが失敗した。
macOSからのSFTP接続テストは成功するのに、NextEngineのカスタムデータ作成側からのアップロードだけが失敗するという現象。

## 問題の症状

- 成功: 手動SFTP接続（`sftp partner-sftp@server`）
- 成功: NextEngineの接続テスト
- 失敗: NextEngineのカスタムデータ作成からの実際のファイルアップロード

SSHDのDEBUG3ログを確認すると、接続は確立されるがSFTPチャネルが即座に閉じられていた。

```bash
debug2: subsystem request for sftp by user partner-sftp [postauth]
debug3: receive packet: type 97 [postauth]  # CHANNEL_CLOSE from client
debug2: channel 0: rcvd close [postauth]
Connection closed by 3.114.101.8 port 38932 [postauth]
```

## 調査プロセス

### 1. OpenSSH 8.7の設定確認

まず、現在のSSHD設定を確認した。

```bash
sshd -T | grep -E "ciphers|kexalgorithms|macs|hostkeyalgorithms"
```

出力から、`ssh-rsa`（RSA/SHA-1署名）がリストに**存在しない**ことが判明。

```bash
hostkeyalgorithms ecdsa-sha2-nistp256,ecdsa-sha2-nistp256-cert-v01@openssh.com,
                  [...], rsa-sha2-256, rsa-sha2-512
```

### 2. JSCH-0.1.54の調査

NextEngineサポートへの問い合わせで、以下の情報を得た。

- 使用ライブラリ: JSCH-0.1.54（2016年リリース）
- Java環境: JDK 1.7
- アップグレード予定: 2026年（JDK 1.8へ移行）

### 3. OpenSSH 8.7

OpenSSH 8.7では、`ssh-rsa`署名は**デフォルトで無効化**されている。

### 4. 根本原因の特定

**JSCH-0.1.54は`ssh-rsa`（SHA-1）署名しかサポートしていない**が、**OpenSSH 8.7はデフォルトではSHA-1を拒否する**
ため、アルゴリズムネゴシエーションが失敗していた。

## 解決策の検討

### 選択肢A: AWS Transfer Family（セキュア）

**メリット**:

- マネージドサービスでレガシークライアント対応が良好
- サーバー側のセキュリティレベルを維持

**デメリット**:

- コストがかかる
- 設定作業が必要

### 選択肢B: 限定的セキュリティダウングレード（採用）

**メリット**:

- 追加コストなし
- 設定変更のみで解決

**デメリット**:

- レガシーアルゴリズムをグローバルに許可
- 理論的なセキュリティリスク

最終的に、コストと緊急性を考慮して**選択肢B**を採用した。

## 実装した対策

### 1. グローバルレガシーアルゴリズム許可

OpenSSHのMatchブロックでは`HostKeyAlgorithms`、`KexAlgorithms`、`Ciphers`、`MACs`を設定できないため、グローバルスコープで追加した。

```bash
# /etc/ssh/sshd_config

# TODO: Remove after NextEngine upgrades to JDK 1.8+ (planned 2026)
HostKeyAlgorithms +ssh-rsa
KexAlgorithms +diffie-hellman-group14-sha1,diffie-hellman-group1-sha1
Ciphers +aes128-cbc,aes256-cbc
MACs +hmac-sha1

# SFTP Configuration for partner-sftp
Match User partner-sftp
    ForceCommand internal-sftp
    ChrootDirectory /srv/sftp-root/partner
    PasswordAuthentication yes
    PermitTunnel no
    AllowAgentForwarding no
    AllowTcpForwarding no
    X11Forwarding no
    PubkeyAcceptedAlgorithms +ssh-rsa
```

### 2. 設定反映と確認

```bash
# 設定確認
sshd -T -C user=partner-sftp | grep hostkeyalgorithms
# 出力: ecdsa-sha2-nistp256, [...], rsa-sha2-256, rsa-sha2-512, ssh-rsa
#                                                                  ↑最後に追加される
```

### 3. 動作確認

設定適用後、NextEngineのカスタムデータ作成からのアップロードが成功した。

## 学んだこと

### レガシーシステムとの互換性

古いクライアントライブラリ（JSCH-0.1.54）が、モダンなサーバー（OpenSSH 8.7+）と通信できないケースが現実に存在する。
アップグレード時は、外部システムとの互換性を事前に確認する必要がある。

## まとめ

Amazon Linux 2023（OpenSSH 8.7）とJDK 1.7のJSCH-0.1.54間でSFTP接続が失敗した原因は、**SHA-1署名アルゴリズムのサポート状況の不一致**だった。

- 原因: JSCH-0.1.54は`ssh-rsa`（SHA-1）のみサポート、OpenSSH 8.7はSHA-1を無効化
- 解決策: グローバルにレガシーアルゴリズムを許可（`+ssh-rsa`等）

## 参考リンク

- [OpenSSH 8.7 Release Notes](https://www.openssh.com/txt/release-8.7)
- [SSH 公開鍵を ssh-rsa から強い暗号に書き換える ](https://qiita.com/katzueno/items/4319fffc8b0b0b50d8a6)
