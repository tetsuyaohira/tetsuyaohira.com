---
title: "Node.js + TypeScriptでexpressの入力支援、型推論を表示させるまで"
date: "2023-04-02"
---

## `typescript`、`express`をインストール

``` bash
npm init -y
npm install typescript
npx tsc --init
npm install express
```

## `app.ts`を作成
``` js
touch app.ts
```

## `app.ts`で`express`をrequireしたところエラーが出た

``` js
const express = require('express')
```

![2023-04-02-05.png](/images/2023-04-02-05.png)

```
TS2580: Cannot find name 'require'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
```

- TypeScriptは`node.js`の関数である`require`を理解していない
- `require`を理解させるために`Node.js`の型定義ファイルが必要
- エラー内容に従って`@types/node`をインストール
- `@types/node`はNode.jsの型定義ファイル
- インストールすると、エラーが解消される

``` bash
npm install -D @types/node
```

## インポートした`express`で入力支援が行われない

![2023-04-02-01.png](/images/2023-04-02-01.png)

- `app.`と入力しても、`listen`などが入力支援で出てこない
- `app`の型推論が`any`になっておりexpress用の型定義ファイルが無いため
- `express`用の型定義ファイルである`@types/express`をインストールする

``` bash
npm install -D @types/express
```

しかし、まだでない

![2023-04-02-02.png](/images/2023-04-02-02.png)

- そもそも`require`にカーソルを合わせて見てみると、`any`を返す関数として定義されている

![2023-04-02-03.png](/images/2023-04-02-03.png)

```
TS80005: 'require' call may be converted to an import.
```

- TypeScriptはこの`require`関数が何をしているのか知らない状態
- TypeScriptで正しく機能させるためには、TypeScriptにあるモジュールシステムである`import`を使わないといけない
- `require`を`import`に変更する

```js
// const express = require('express')
import express from 'express' // これに変更

const app = express()
```

- 正しく入力支援が出るようになりました。

![2023-04-02-04.png](/images/2023-04-02-04.png)
