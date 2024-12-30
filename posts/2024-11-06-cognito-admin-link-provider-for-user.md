---
title: "Amazon Cognitoのユーザーにフェデレーションユーザーをリンクする"
date: "2024-11-06"
---

## はじめに

- AWS CLIを使用して`AdminLinkProviderForUser`を実行するコマンドを紹介する
- 仕事でCognitoのアカウントにフェデレーションユーザーをリンクしたテストアカウントを何回も作成する必要があったので、備忘録として残しておく
- フェデレーションユーザーのリンクはマネージメントコンソールからは設定できないため、AWS APIを呼び出す必要がある

## 前提

- AWS CLIがインストールされていること
- 実行環境の`IAM ロール`またはユーザーに、`cognito-idp:AdminLinkProviderForUser`の権限が付与されていること。

## AWS CLIのコマンド

- 以下のコマンドを使用して、AdminLinkProviderForUser を実行できます。

```bash
aws cognito-idp admin-link-provider-for-user \
    --user-pool-id <ユーザープールID> \
    --destination-user ProviderName="Cognito",ProviderAttributeValue="<既存ユーザーのユーザー名>" \
    --source-user ProviderName="<IDプロバイダー名>",ProviderAttributeName="Cognito_Subject",ProviderAttributeValue="<外部プロバイダーのユーザーID>"
```

### パラメータの説明

- `--user-pool-id`: 対象となるユーザープールの ID。例: ap-northeast-1_XXXXXXXXX
- `--destination-user`: リンク先のユーザー情報（既存のユーザープールユーザー）
    - `ProviderName`: 通常は "Cognito" を指定
    - `ProviderAttributeValue`: リンク先ユーザーのユーザー名。通常はユーザープール内のユーザー名（Username）を指定
- `--source-user`: リンク元のユーザー情報（外部 ID プロバイダーのユーザー）
    - `ProviderName`: 外部 ID プロバイダーの名前。例: "Facebook", "Google", "LoginWithAmazon" など
    - `ProviderAttributeName`: 通常は "Cognito_Subject" を指定
    - `ProviderAttributeValue`: 外部 ID プロバイダーのユーザー ID

### 具体的な例

- 例えば、ユーザープール ID が `ap-northeast-1_abcdefgh`、既存ユーザーのユーザー名が`john_doe`、外部プロバイダーが`Facebook`
  で、そのユーザー ID が`1234567890`の場合、以下のようになります。

```bash
aws cognito-idp admin-link-provider-for-user \
    --user-pool-id ap-northeast-1_abcdefgh \
    --destination-user ProviderName="Cognito",ProviderAttributeValue="john_doe" \
    --source-user ProviderName="Facebook",ProviderAttributeName="Cognito_Subject",ProviderAttributeValue="1234567890"
```

### 実行結果

- 操作が成功すると、特に出力はない。エラーが発生した場合は、エラーメッセージが表示される

## 参考

- [AdminLinkProviderForUser](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminLinkProviderForUser.html)
- [フェデレーションユーザーを既存のユーザープロファイルにリンクする](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-user-pools-identity-federation-consolidate-users.html)
- [サードパーティー経由のユーザープールへのサインインの追加
  ](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-user-pools-identity-federation.html)

