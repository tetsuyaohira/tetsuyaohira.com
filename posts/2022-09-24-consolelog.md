---
title: "console.logをもっと使いこなす！"
date: "2022-09-24"
description: "console.logを超えるConsole APIの活用術。カスタムCSSスタイリング、文字列置換、時間計測、グループ化なら30以上の便利機能を実例付きで解説"
tags: ["JavaScript", "console", "Console API", "デバッグ", "CSS", "フロントエンド", "開発ツール"]
---

ブラウザ上でのデバッグにconsole.log()をよく使いますが、MDNのConsole APIのページを見ると色々ありましたので調べてみました。

[MDN Console API](https://developer.mozilla.org/ja/docs/Web/API/Console_API)

## よく使うコンソールメソッド
`console.log()`： ログ情報の一般的な出力用。
`console. info()`： 有益な情報の出力用。
`console.warn()`： 警告メッセージの出力用。
`console.error()`： エラーメッセージの出力用。
![よく使うコンソールメソッド](../../images/2022-09-24-01.png)


## console.log()のカスタムCSSスタイル
`console.log`の引数にCSSを指定し、`%c`ディレクティブを使用すると出力結果にスタイルを適用できます。
ディレクティブの前のテキストは影響を受けず、ディレクティブの後ろのテキストが装飾されます。
![カスタムCSSスタイル](../../images/2022-09-24-02.png)


## 文字列の置換
文字列を受け取る console オブジェクトのメソッド (log() など) の 1 つに文字列を渡す場合、次の置換文字列を使用できます。
`%s`： string
`%i`または`%d`： integer
`%o`または`%0`： object
`%f`： float
![文字列の置換](../../images/2022-09-24-03.png)


## `console.assert()`
最初の引数が false の場合、メッセージとスタック トレースをコンソールに出力します。
![console.assert()](../../images/2022-09-24-04.png)


## `console.clear()`
コンソールをクリアします。
![console.clear()](../../images/2022-09-24-05.png)


## `console.count()`
この関数が呼び出された回数を出力します。
![console.count()](../../images/2022-09-24-06.png)


## `console.dir()`
指定された JavaScript オブジェクトのプロパティの対話型リストを表示します。
![console.dir()](../../images/2022-09-24-07.png)
`console.log`との使い分けがわからない🙄


## `console.group()`と`console.groupEnd()`
新しいインライングループを作成し、後続のすべての出力を別のレベルでインデントします。
レベルを戻すには、`groupEnd()`を呼び出します。
![console.group()](../../images/2022-09-24-08.png)


## `console.memory`
メモリプロパティを使用して、ヒープサイズを確認できます。
注: メモリはプロパティであり、メソッドではありません。
![console.memry](../../images/2022-09-24-09.png)


## `console.table()`
表形式として表示します。
![console.table()](../../images/2022-09-24-10.png)


## `console.time()`と`console.timeEnd()`
`console.time()`： 入力パラメーターとして指定された名前でタイマーを開始します。特定のページで最大 10,000 の同時タイマーを実行できます。
`console.timeEnd()`： 指定されたタイマーを停止し、開始からの経過時間を秒単位でログに記録します。
![console.time()](../../images/2022-09-24-11.png)


## `console.trace()`
スタック トレースを出力します。
![console.trace()](../../images/2022-09-24-12.png)

