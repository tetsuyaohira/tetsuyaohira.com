---
title: "Next.js 16とReact 19へアップデートした記録"
date: "2026-04-01"
description: "Pages Router + static export構成のまま、Next.js 16、React 19、TypeScript 6、Jest 30へ更新した。next lint廃止やESLint 10の既知不具合など、今回ハマった点もまとめる"
tags: ["Next.js", "React", "TypeScript", "ESLint", "Jest", "TailwindCSS", "ライブラリアップデート", "Amplify", "Pages Router"]
---

## はじめに

[前回のライブラリアップデート](../2025-06-02-nextjs-library-update/)で、このブログをNext.js 14系まで引き上げた。
そこからしばらく運用していたが、今回はさらに `Next.js 16` と `React 19` まで上げることにした。

今回のブログは `Pages Router` のまま運用しており、`output: 'export'` を使った静的サイト構成である。
App Routerに移行せず、今の構成を維持したままどこまで素直に上げられるかを確認しながら進めた。

## 今回のアップデート方針

今回の方針はかなりシンプルで、以下の3点を守ることにした。

1. **Pages Routerは維持する**
2. **static export構成は維持する**
3. **ビルド、lint、typecheck、testが全部通る状態まで持っていく**

「せっかくだからApp Routerに移行するか」は一瞬考えたが、今回の目的はアーキテクチャ変更ではなく、あくまでライブラリ更新である。
こういうときに欲張るとだいたい事故るので、そこは切り分けた。

## 更新前と更新後

主な変更は以下の通り。

- Next.js: `14.2.16` → `16.2.2`
- React: `18.2.0` → `19.2.4`
- React DOM: `18.2.0` → `19.2.4`
- TypeScript: `5.8.3` → `6.0.2`
- Jest: `29.5.0` → `30.3.0`
- @testing-library/react: `14.0.0` → `16.3.2`
- @testing-library/jest-dom: `5.16.5` → `6.9.1`
- Tailwind CSS: `4.1.8` → `4.2.2`
- prettier: `3.3.0` → `3.8.1`

一方で、当初は `ESLint 10` に上げるつもりだったが、最終的には `9.39.4` に落ち着いた。
これについては後述する。

## まずやったこと

いきなり `npm install` で全部上げる前に、先に現状の壊れ方を整理した。

その結果、更新前の時点ですでに `tsc --noEmit` が通っていなかった。
原因はテストコードに残っていた不要な import で、これがまず地味に嫌だった。

```tsx
import { all } from 'mdast-util-to-hast'
```

この import は使われておらず、型チェックを落とすだけのノイズだったので削除した。
ライブラリアップデートで大事なのは、「更新で壊れたのか」「もともと壊れていたのか」を分けることだと思っている。

## Next.js 16対応でやったこと

### 1. `next lint` の廃止対応

Next.js 16では `next lint` が削除された。
そのため、lint スクリプトは ESLint CLI に置き換えた。

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

設定ファイルも `.eslintrc.json` から `eslint.config.mjs` に移行した。

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])
```

プロフィール画像については、今回は `next/image` に移行しなかった。
このブログは static export 構成なので、ローカル画像1枚のために custom loader を増やすのはやりすぎだと判断した。

### 2. `swcMinify` の削除

`next.config.js` に残っていた `swcMinify` も削除した。
これは古い設定の名残で、今の Next.js では不要である。

```js
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
}
```

### 3. Node.js バージョンの下限を明示

Next.js 16 は `Node.js 20.9.0` 以上が前提になる。
今回は Amplify で動かす前提なので大きな問題にはなりにくいが、ローカルとCIの期待値を揃えるために `engines` と `.nvmrc` を追加した。

```json
{
  "engines": {
    "node": ">=20.9.0"
  }
}
```

## TypeScript 6で引っかかったところ

TypeScript 6へ上げたあと、これまで何も言わなかった `tsconfig.json` に怒られた。

特に問題だったのはこの2つ。

- `target: "es5"`
- `moduleResolution: "node"`

このままだと非推奨扱いで止まるため、以下のように更新した。

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "jsx": "react-jsx",
    "moduleResolution": "bundler"
  }
}
```

ちなみに `jsx: "react-jsx"` は、`next build` 実行時に Next.js 側でも自動調整が入った。
地味だが、こういう「フレームワークに合わせて設定が自然に寄っていく」感覚は嫌いじゃない。

また、`typecheck` を正式なスクリプトにしたことで、`describe`, `it`, `expect` の型が足りていないことも発覚した。
そのため `@types/jest` も追加している。

## 想定外だったのは ESLint 10

ここが今回いちばん面白くて、そしてちょっとイラっとしたところだった。

最初は計画どおり `ESLint 10` に上げたのだが、`eslint-config-next` 経由で以下のエラーが発生した。

```txt
TypeError: Error while loading rule 'react/display-name':
contextOrFilename.getFilename is not a function
```

アプリのコードが悪いわけではなく、Next.js 側の既知不具合に踏んでいた。
なので、ここは変に気合いでねじ伏せず、`ESLint 9.39.4` に下げて安定運用を優先した。

こういうときに大事なのは、「最新版を入れること」ではなく「壊れていない状態を保つこと」だと思う。
無理にESLint 10へ固執しても得るものがなかった。

## JestとTesting Libraryの更新

テスト周りも以下のように更新した。

- Jest: `29` → `30`
- `jest-environment-jsdom`: `29` → `30`
- `@testing-library/react`: `14` → `16`
- `@testing-library/jest-dom`: `5` → `6`

このとき、`@testing-library/react` 16系では `@testing-library/dom` が peer dependency になっているため、これも明示的に追加した。

テストスクリプトも watch 用とは別に、CI向けのものを追加した。

```json
{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --runInBand",
    "typecheck": "tsc --noEmit"
  }
}
```

## 最終的に確認したこと

更新後は以下をすべて通した。

- `npm run lint`
- `npm run typecheck`
- `npm run test:ci`
- `npm run build`
- `npm run dev`

`npm run build` では、Pages Router + static export の構成のまま問題なく静的ページが生成された。
また、`npm run dev` でトップページと記事詳細ページの応答も確認できたので、最低限の運用ラインはクリアできたと判断している。

## 今回のアップデートでよかったこと

- Next.js 16 まで上げても、Pages Router + static export はまだ十分運用できると確認できた
- `typecheck` を正式な確認項目に組み込めた
- 使っていない古い設定や不要 import を掃除できた
- Node.js の下限を repo に明示できた

単なるバージョンアップに見えて、実際には「今の構成でどこまで健全に保てるか」を確認する良い機会になった。

## まとめ

今回のアップデートでは、Next.js 16、React 19、TypeScript 6、Jest 30まで引き上げることができた。
一方で、`ESLint 10` のように「最新版にしたいけど、現時点ではまだ早い」というものもあった。

やはりライブラリアップデートは、最新バージョンを機械的に追うだけではダメで、
「今このプロジェクトで実際に動くか」「運用に耐えるか」を見ながら判断するのが大事だと思う。

このブログはしばらく `Pages Router` のまま運用する予定だが、次に大きく触るとしたら App Router 移行か、画像最適化まわりの見直しになりそうである。
