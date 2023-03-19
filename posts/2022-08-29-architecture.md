---
title: "Webサイトの構成"
date: "2022-08-29"
---

## Webサイトの構成

Next.js + AWS S3 + Cloudfrontで構築しています。

``` bash
next build && next export
```

でHTMLに変換したファイルをAWS S3にアップロードして
AWS Cloudfront経由でアクセスできるようにしています。

当初は、Node.js + AWS Fargateで構築しようと思っていましたが、
静的サイトで十分だったため、Next.js + AWS S3 + Cloudfrontで構築しました。

## 記事
- Markdownで書いています。
## Reactフレームワーク
- Next.js
## CSSフレームワーク
- なし
## Markdownの変換ライブラリ
- remark (https://remark.js.org)
- remark-html