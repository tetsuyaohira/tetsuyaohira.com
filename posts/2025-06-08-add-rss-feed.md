---
title: "Next.jsの静的ブログサイトにRSSフィードを追加した"
date: "2025-06-08"
description: "Next.jsの静的サイト生成ブログにRSSフィードを実装。ビルド時のXML生成、gray-matterでのfront matter処理、package.jsonのスクリプト統合などの実装手順を紹介"
tags: ["Next.js", "RSS", "静的サイト生成", "gray-matter", "XML", "ブログ", "ビルドスクリプト"]
---

このブログサイトにRSSフィードを追加した。実装方法とその際の設計判断について記録する。

## 実装方針

RSSフィードの実装方法として、以下の2つの選択肢があった

1. APIルート（`pages/api/rss.xml.ts`）で動的生成
2. ビルド時に静的ファイル（`public/rss.xml`）として生成

このサイトは`output: 'export'`で静的サイト生成しているため、ビルド時生成を選択した。

## 実装手順

### 1. RSS生成スクリプトの作成

`scripts/generate-rss.js`を作成

```javascript
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');
const siteUrl = 'https://tetsuyaohira.com';

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateRssFeed() {
  // 投稿データを読み込んで日付順にソート
  const posts = getSortedPostsData();
  
  // RSS形式のXMLを生成
  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tetsuya Ohira's Blog</title>
    <link>${siteUrl}</link>
    <description>技術ブログ - Web開発、プログラミング、その他技術的な話題</description>
    <language>ja</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  // public/rss.xmlに書き出し
  fs.writeFileSync(path.join(process.cwd(), 'public/rss.xml'), rssFeed);
}
```

### 2. ビルドプロセスへの組み込み

`package.json`のビルドスクリプトを修正

```json
{
  "scripts": {
    "build": "node scripts/generate-rss.js && next build",
    "generate-rss": "node scripts/generate-rss.js"
  }
}
```

これにより、`npm run build`実行時に自動的にRSSフィードが生成される。

### 3. gitignoreへの追加

生成されるファイルはgitで管理しないのが慣例のため、`.gitignore`に追加

``` gitignore
# generated files
/public/rss.xml
```

## 設計上の判断

### なぜTypeScriptではなくJavaScriptを使ったか

当初`lib/rss.ts`としてTypeScriptで実装したが、ビルド時にはまだTypeScriptがコンパイルされていないため、Node.jsで直接実行できるJavaScriptで実装した。

## 結果

`https://tetsuyaohira.com/rss.xml`でRSSフィードが配信されるようになった。新しい記事を追加してビルドすると、自動的にRSSフィードも更新される。


静的サイト生成の利点を活かしつつ、シンプルで保守しやすい実装ができた。