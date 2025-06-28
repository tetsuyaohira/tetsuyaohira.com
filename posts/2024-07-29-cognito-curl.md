---
title: "Amazon Cognitoの認証をcurlで試す"
date: "2024-07-29"
description: "Amazon Cognitoの認証フローをcurlコマンドでテストする方法。Secret Hashの生成、初回認証、リフレッシュトークンを使った更新の具体例を紹介"
tags: ["AWS", "Amazon Cognito", "curl", "認証", "JWT", "Secret Hash", "アクセストークン", "リフレッシュトークン"]
---

## はじめに
- Amazon Cognitoを使った認証基盤の構築で、動作確認のためcurlで認証を試したい場合がある
- 何度も実行するため、備忘録として残しておく。
- なお、Amazon Cognitoの設定やユーザープールの作成については割愛する。
## curlでAmazon Cognitoの認証を試す
### 事前準備
- AWSマネジメントコンソールから`Client ID`と`Client Secret`を取得しておく
### 認証リクエスト
- パラメタには、`Secret Hash`が必要なので、`Secret Hash`を生成する
```bash
CLIENT_ID="<YOUR_CLIENT>"
CLIENT_SECRET="<YOUR_SECRET>"
EMAIL="<YOUR_EMAIL>"
echo -n "$EMAIL$CLIENT_ID" | openssl dgst -sha256 -hmac "$CLIENT_SECRET" -binary | base64
```
- `Secret Hash`を生成したら、以下のリクエストを送信する
```bash
curl --location \
--request POST 'https://cognito-idp.ap-northeast-1.amazonaws.com/' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth' \
--data-raw '
{"ClientId": "<YOUR_CLIENT>",
"AuthFlow": "USER_PASSWORD_AUTH",
"AuthParameters":{
"USERNAME": "<YOUR_EMAIL>",
"PASSWORD": "<YOUR_PASSWORD",
"SECRET_HASH": "<CREATED_SECRET_HASH>"
}}'
```

- 実行結果
```bash
{
  "AuthenticationResult": {
    "AccessToken": "accessToken",
    "ExpiresIn": 3600,
    "IdToken": "idToken",
    "RefreshToken": "refreshToken",
    "TokenType": "Bearer"
  },
  "ChallengeParameters": {}
}
```

### リフレッシュトークンリクエスト
- リフレッシュトークンを使って、アクセストークンを再取得する
- Secret Hashの生成では、`email`ではなく`sub`を使うので注意
```bash
CLIENT_ID="<YOUR_CLIENT>"
CLIENT_SECRET="<YOUR_SECRET>"
SUB="<YOUR_SUB>"
echo -n "$SUB$CLIENT_ID" | openssl dgst -sha256 -hmac "$CLIENT_SECRET" -binary | base64
```
- `Secret Hash`を生成したら、以下のリクエストを送信する
```bash
curl --location \
--request POST 'https://cognito-idp.ap-northeast-1.amazonaws.com/' \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth' \
--data-raw '
{"ClientId": "<YOUR_CLIENT>",
"AuthFlow": "REFRESH_TOKEN_AUTH",
"AuthParameters": {
"REFRESH_TOKEN": "<YOUR_REFRESH_TOKEN>",
"SECRET_HASH": "<CREATED_SECRET_HASH>"
}}'
```
## 参考
- [InitiateAuth](https://docs.aws.amazon.com/ja_jp/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html#API_InitiateAuth_Examples)
- [Cognito adminInitiateAuthのREFRESH_TOKENフローでSECRET_HASHが合致しないエラーが発生する](https://qiita.com/nori3tsu/items/7fa72c297f93efd0b3bb)