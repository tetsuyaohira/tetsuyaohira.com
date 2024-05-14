---
title: "楽天ROOMに投稿した商品を削除するSelenium IDE定義"
date: "2024-05-14"
---

## はじめに

- 2023年12月に楽天ROOMに自動投稿するNode.jsアプリケーションを作成した
- 楽天ROOMに投稿できる上限は20,000件
- 2024年5月12日に上限に達したため投稿した商品を全削除する必要があった

## 実現方法

- Chrome拡張の「Selenium IDE」を使用し投稿の削除を自動化

## 使い方

- ブラウザで楽天ROOMを開きログイン
- Chrome拡張の「Selenium IDE」をインストール
- Selenium IDEで「rakuten-room-delete-post.side」を開く
- Command「Open」のTargetに自身の楽天ROOMのURLを入力
- テストを実行

## GitHubリポジトリ

[GitHubリポジトリ](https://github.com/tetsuyaohira/rakuten-room-delete-post)

## 留意点

- 4,5秒に1投稿を削除できるので、20,000件の投稿を削除するのに約23時間かかる

## 参考

- Selenium IDE [Chromeウェブストア](https://chrome.google.com/webstore/detail/selenium-ide/mooikfkahbdckldjjndioackbalphokd)
- [ついに完成！？楽天ROOMの商品を自動削除する方法を解説します！](https://gorilabo.com/room_auto_delete-2)