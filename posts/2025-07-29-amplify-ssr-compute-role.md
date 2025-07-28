---
title: "AWS AmplifyのSSRでIAMロール認証が効かない→Compute Roleで解決"
date: "2025-07-29"
description: "Next.js 15のAmplify SSRで、IAMアクセスキーからロールベース認証に移行する際に遭遇したCredentialsProviderErrorと、Compute Roleによる解決方法"
tags: [ "AWS", "Amplify", "Next.js", "IAM", "SSR", "DynamoDB" ]
---

# AWS AmplifyのSSRでIAMロール認証が効かない→Compute Roleで解決

Next.js 15のSSRアプリをAWS Amplifyでホスティングしている際、セキュリティ向上のためIAMアクセスキーからロールベース認証への移行を試みたところ、意外な落とし穴にハマってしまった。

## 背景

開発していたWebアプリケーションでは、以下のAWSサービスを使用していた

- **AWS Amplify**: Next.js 15 SSRのホスティング
- **DynamoDB**: アプリケーションデータの保存
- **S3**: ファイルストレージ
- **Lambda**: バックエンド処理

当初は環境変数でIAMアクセスキーを管理していたが、セキュリティベストプラクティスに従い、IAMロールベース認証に移行することにした。

## 問題の発生

### 環境変数の削除

まず、Amplifyアプリの環境変数から以下を削除した

```bash
# 削除した環境変数
IAM_ACCESS_KEY_ID=AKIAXXXXXXXXXXXX
IAM_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxx
```

### IAMポリシーの作成とアタッチ

Amplifyアプリに自動生成されたIAMロール（`AmplifySSRLoggingRole-xxx`）に、以下の権限を持つポリシーをアタッチした

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:ap-northeast-1:*:table/my-app-*"
    },
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-app-*",
        "arn:aws:s3:::my-app-*/*"
      ]
    }
  ]
}
```

### 結果：CredentialsProviderError

しかし、デプロイ後にアクセスすると以下のエラーが発生した

```
⨯ Error [CredentialsProviderError]: Could not load credentials from any providers
```

## 試行錯誤した解決策

### 1. AWS SDKの設定見直し

AWS SDK v3のクライアント初期化を以下のように修正した

```typescript
// 修正前
const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.IAM_ACCESS_KEY_ID,
    secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY,
  },
  region: 'ap-northeast-1',
});

// 修正後
const getAwsCredentials = () => {
  const accessKeyId = process.env.IAM_ACCESS_KEY_ID;
  const secretAccessKey = process.env.IAM_SECRET_ACCESS_KEY;

  if (accessKeyId && secretAccessKey) {
    return { accessKeyId, secretAccessKey };
  }

  return undefined; // IAMロール自動検出に任せる
};

const credentials = getAwsCredentials();
const config = {
  region: 'ap-northeast-1',
};

if (credentials) {
  config.credentials = credentials;
}

const client = new DynamoDBClient(config);
```

**結果：依然としてエラー**

### 2. fromNodeProviderChainの使用

AWS SDK v3の高度なクレデンシャルプロバイダーを試した

```typescript
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';

const client = new DynamoDBClient({
  region: 'ap-northeast-1',
  credentials: fromNodeProviderChain(),
});
```

**結果：依然としてエラー**

### 3. 環境変数の追加

AWS_REGIONなどの標準的な環境変数を追加してみた

```bash
REGION=ap-northeast-1
```

**結果：依然としてエラー**

## 真の解決策：Compute Role

クラスメソッドの[記事](https://dev.classmethod.jp/articles/iam-compute-roles-for-server-side-rendering-with-aws-amplify/)
を発見し、**Compute Role**の存在を知った。

### Compute Roleとは

AmplifyのSSR環境では、以下の2つの異なるロールが存在する

1. **Service Role** (`iamServiceRoleArn`): Amplifyサービス自体の操作用
2. **Compute Role**: SSRアプリケーションからAWS APIを呼び出す際に使用

今まで設定していたのはService Roleのみで、SSRからのAPI呼び出しには**別途Compute Role**が必要だった。

### Compute Roleの作成

Terraformで以下のようにCompute Roleを作成した

```hcl
# Compute Role用の信頼ポリシー
data "aws_iam_policy_document" "amplify_compute_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = ["amplify.amazonaws.com"]
    }
  }
}

# Compute Role作成
resource "aws_iam_role" "amplify_compute_role" {
  name               = "my-app-dev-amplify-compute-role"
  assume_role_policy = data.aws_iam_policy_document.amplify_compute_assume_role.json
}

# アプリケーション権限のアタッチ
resource "aws_iam_role_policy_attachment" "amplify_compute_permissions" {
  role       = aws_iam_role.amplify_compute_role.name
  policy_arn = aws_iam_policy.amplify_app_permissions.arn
}
```

### Compute RoleをAmplifyブランチに設定

AWS CLIでCompute RoleをAmplifyブランチに設定した

```bash
aws amplify update-branch \
  --app-id your-app-id \
  --branch-name main \
  --compute-role-arn arn:aws:iam::123456789012:role/your-compute-role
```

## 結果：解決！

Compute Roleの設定後、CredentialsProviderErrorが完全に解消され、DynamoDB、S3、Lambdaへのアクセスが正常に動作するようになった。

## 学んだこと

### AmplifyのSSRでは2つのロールが必要

- **Service Role**: Amplifyサービス自体の操作（ログ出力など）
- **Compute Role**: SSRアプリケーションからのAWS API呼び出し

### 認証の使い分け

最終的に以下のような認証戦略になった

- **localhost開発環境**: IAMアクセスキー
- **Amplify本番環境**: Compute Role

```typescript
export const getAwsCredentials = () => {
  const accessKeyId = process.env.IAM_ACCESS_KEY_ID;
  const secretAccessKey = process.env.IAM_SECRET_ACCESS_KEY;

  // 両方の環境変数がある場合のみcredentialsを返す（localhost）
  if (accessKeyId && secretAccessKey) {
    return { accessKeyId, secretAccessKey };
  }

  // 環境変数がない場合はundefinedを返す（Amplify：Compute Roleを使用）
  return undefined;
};
```

## まとめ

AmplifyのSSRでIAMロールベース認証を使用する際は、単純にService Roleにポリシーをアタッチするだけでは不十分で、**専用のCompute Roleの作成と設定が必要**ということが分かった。

## 参考リンク

- [AWS Amplify: SSR Compute roleの追加](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-compute-role.html)
- [クラスメソッド: AWS AmplifyのServer-Side Renderingでもじゃもじゃ権限管理からおさらばのIAM Compute Role](https://dev.classmethod.jp/articles/iam-compute-roles-for-server-side-rendering-with-aws-amplify/)