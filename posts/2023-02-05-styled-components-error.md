---
title: 'Next.jsでStyled Componentsを適用するとconsoleに`Warning: Prop `className` did not match. Server: "sc-eDWCr gHhIrJ" Client: "sc-eDvSVe jXCRWx"`エラーが発生しスタイルが適用されない'
date: "2023-02-05"
description: "Next.js SSRでStyled-componentsのクラス名不一致エラー解決法。babel-plugin-styled-componentsによるサーバー・クライアント同期の設定方法"
tags: ["Next.js", "Styled Components", "SSR", "エラー解決", "babel", "CSS-in-JS", "React"]
---

## 事象
- Next.jsのSSRアプリケーションでStyled-componentsが適用されない

## エラーメッセージ
``` bash
Warning: Prop `className` did not match. Server: "sc-eDWCr gHhIrJ" Client: "sc-eDvSVe jXCRWx" 
```

## 原因
- サーバー側とクライアント側で生成されるクラス名が異なるため、スタイルが適用されない

## 解決方法
 - `babel-plugin-styled-components`をインストール
``` bash
npm install --save-dev babel-plugin-styled-components
```
 - `.babelrc`を配置
``` json
{
  "presets": ["next/babel"],
  "plugins": [["styled-components", { "ssr": true }]]
}
```