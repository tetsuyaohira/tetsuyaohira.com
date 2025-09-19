---
title: 'DockerコンテナからRDSへTLS接続するときの証明書エラー対応'
date: '2025-09-19'
description: 'PHP 8.4 のコンテナから AWS RDS MySQL へ接続した際に発生した TLS 証明書エラーの原因と、Dockerfile 組み込みで解決した手順をまとめる。'
tags: ['AWS', 'RDS', 'Docker', 'MySQL', 'TLS']
---

## きっかけ

PHP 8.4 ベースの CLI コンテナから AWS RDS(MySQL) に接続したところ、`Certificate verification failure: The certificate is NOT trusted.` という TLS エラーで弾かれた。ホスト環境や DataGrip では問題なく接続できたため、コンテナ固有の問題だと判断した。

## 問題

- RDS への接続時に TLS 検証が必須
- ベースイメージに RDS のルート証明書が含まれていない
- `mysql` CLI も PDO もサーバ証明書を信用できず接続に失敗

## 解決方針

- Docker イメージのビルド時に AWS 公式のルート証明書バンドルを取得する
- `update-ca-certificates` で信頼ストアへ登録し、CLI/PHP 双方が自動参照できる状態にする

## 対応手順

Dockerfile に以下の処理を追加した。

```Dockerfile
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        unzip \
        libzip-dev \
        libicu-dev \
        libxml2-dev \
        libcurl4-openssl-dev \
        libonig-dev \
        default-mysql-client \
    && curl -fsSL https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
        -o /usr/local/share/ca-certificates/aws-rds.crt \
    && update-ca-certificates
```

ポイントは以下の通り

- `ca-certificates` と `curl` を入れて証明書を取得
- 公式の `global-bundle.pem` を `/usr/local/share/ca-certificates/aws-rds.crt` として配置
- `update-ca-certificates` で `/etc/ssl/certs/aws-rds.crt` が信頼ストアへ展開される
- その後に PHP 拡張やその他のパッケージをインストール

## 動作確認

### mysql CLI

```bash
docker compose run --rm app \
  mysql \
    -h <your-rds-endpoint>.ap-northeast-1.rds.amazonaws.com \
    -uroot -p \
    --ssl-mode=VERIFY_IDENTITY \
    eccube
```

証明書パスを明示しなくても TLS エラーが解消され、`SHOW DATABASES;` が通ることを確認した。`update-ca-certificates` が `/etc/ssl/certs` にシンボリックリンクを展開してくれるため、`mysql` クライアントは自動的に信頼済み証明書を参照するようだ。

### PHP(PDO)

```php
$pdo = new PDO(
    'mysql:host=<your-rds-endpoint>.ap-northeast-1.rds.amazonaws.com;dbname=eccube;charset=utf8mb4',
    getenv('DB_USER'),
    getenv('DB_PASSWORD'),
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]
);
```

PHP からも追加設定なしで TLS 検証が通った。PDO はシステムの信頼ストアを参照できるため、明示的な `PDO::MYSQL_ATTR_SSL_CA` は不要だった。

## まとめ

- 証明書エラーの原因はコンテナの信頼ストアに RDS ルート CA が登録されていなかったこと
- Dockerfile で公式の CA バンドルを取得し `update-ca-certificates` まで済ませれば解決できる
- CLI と PHP は信頼ストアから自動的にルート CA を読み込むため、追加設定なしで TLS 接続を維持できる
