---
title: "Webサイトの構成"
date: "2022-08-29"
description: "Next.js、AWS S3、CloudFrontを使った静的ブログサイトの構築方法。Markdownの記事をremarkで変換してHTML化する技術構成を解説"
tags: ["Next.js", "AWS", "S3", "CloudFront", "技術構成", "静的サイト", "Markdown", "remark"]
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