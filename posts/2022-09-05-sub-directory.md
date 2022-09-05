---
title: "Next.jsのSSGで作成したコンテンツをcloudfront + S3に配置し、サブディレクトリへのアクセスのデフォルトページをindex.htmlにする"
date: "2022-09-05"
---

## 事象
`/posts/[記事ID]/`へアクセスすると、`403 Access Denied`になってしまう。

`/`へは`/index.html`へのリクエストとなりアクセスできる

## 試したこと
### 1. `/posts/[記事ID]/index.html`を生成するよう`next.config.js`を変更
`next.config.js`に`trailingSlash: true`を追加

[trailingSlash](https://nextjs-ja-translation-docs.vercel.app/docs/api-reference/next.config.js/exportPathMap#末尾にスラッシュを追加する)

```
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true　// ここを追加
}
```

この変更によって、
`out`ディレクトリに`posts/[記事ID]/index.html`で出力されるようになった。
![export](../../images/2022-09-05-03.png "export")

### 2. S3の静的ホスティングを有効にする
- Amazon S3 - アクセス許可 - ブロックパブリックアクセス (バケット設定) - 編集をクリック
  - "パブリックアクセスをすべて ブロック"を無効化
- Amazon S3 - アクセス許可 - バケットポリシー - 編集をクリック
  - S3バケットポリシーに以下を追加
  ```angular2html
  {
       "Sid": "PublicReadGetObject",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::tetsuyaohira.com/*"
   }
   ```
- Amazon S3 - プロパティ - 静的ウェブサイトホスティング - 編集をクリック
    - "静的ウェブサイトホスティング"を有効
    - インデックスドキュメントに`index.html`を指定
    - バケットウェブサイトエンドポイントの`http://`以外の部分をコピー
    ![copy-endpoint](../../images/2022-09-05-01.png "copy-endpoint")

### 3. Cloudfrontの設定
- CloudFront - ディストリビューションを選択 - オリジンを選択 - 編集をクリック
  - コピーしたバケットウェブサイトエンドポイントのをoriginに貼り付け
  ![paste-ndpoint](../../images/2022-09-05-02.png "paste-endpoint")

## 結果
- `/posts/[記事ID]/`へアクセスすると、`/posts/[記事ID]/index.html`へのリクエストとなりアクセスできるようになった。
![success](../../images/2022-09-05-04.png "success")
