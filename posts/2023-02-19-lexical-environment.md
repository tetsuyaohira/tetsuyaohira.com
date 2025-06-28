---
title: "`Lexical Environment`(レキシカル環境)と`closure`(クロージャ)の関係を理解する"
date: "2023-02-19"
description: "JavaScriptのレキシカル環境とクロージャの仕組みを詳しく解説。変数の参照先がどのように決まるのか、図解を交えて分かりやすく説明"
tags: ["JavaScript", "クロージャ", "スコープ", "レキシカル環境", "ES6"]
---

## 課題感
- `closure`の理解があやふや
- `closure`は、外側の変数の情報を持った関数と言われるが、下記のコードの`sayFruit2`の中で`sayFruit1`を呼び出した時、🍌でなく🍎が出力されことを感覚では理解していたが、どのような仕様のもとに動作しているのかを知らない
``` js
let food = '🍎'
const sayFruit1 = () => console.log(food)

const sayFruit2 = () => {
    let food = '🍌'
    sayFruit1() // disp 🍎. not 🍌
}
sayFruit2()
```

## 解説
- `Lexical Environment`という概念の理解が必要
- JavaScriptのグローバルスコープ、ブロックスコープ、関数には`Lexical Environment`と呼ばれるオブジェクトを保持している
### 変数
- 変数は`Lexical Environment`のプロパティとして管理される

``` js
let apple = '🍎'
```
このコードの`Lexical Environment`は以下のようになる

![variable](../../images/2023-02-19-01.png)

### コードブロック
- コードブロックに処理が移ると新しい`Lexical Environment`が作成される
- `outerEnv`というプロパティに外部(コードブロック前)の`Lexical Environment`を指し示す
- グローバルスコープ`Lexical Environment`の`outerEnv`は`null`になる
- `outerEnv`は値の保持ではなく、アドレスを保持（スナップショットではない）

``` js
let apple = '🍎'
{
    let banan = '🍌'
}
```

このコードの`Lexical Environment`は以下のようになる

![code block](../../images/2023-02-19-02.png)

### 関数
- 関数オブジェクトが`Lexical Environment`のプロパティに定義される
- 関数が呼び出されると関数に対応した新しい`Lexical Environment`が生成される
- `outerEnv`には、関数呼び出し元の参照がセットされる

``` js
let apple = '🍎'
const sayFruit = (fruit) => {
    console.log(fruit)
    console.log(apple)
}
sayFruit('🍌');
```

このコードの`Lexical Environment`は以下のようになる

![function](../../images/2023-02-19-03.png)

- 変数にアクセスした場合、最初に自身の`Lexical Environment`を探し、見つからなければ`outerEnv`を辿っていく
- `outerEnv`が`null`になるまで辿り、見つからなければ`ReferenceError`が発生する
- `sayFruit`関数内で`apple`にアクセスする時、自身の`Lexical Environment`には`apple`がないので、`outerEnv`を辿り、グローバルの`Lexical Environment`で`apple`が見つかる

### 関数を返す関数
- 関数オブジェクトは`[[environment]]`プロパティを持っている
- `[[environment]]`プロパティは、その関数オブジェクトが作られた場所の`Lexical Environment`を指し示す。**※重要**

``` js
const sayFruitFactory = () => {
    let sayCount = 0
    return (fruit) => {
        sayCount++
        console.log(fruit + sayCount)
    }
} 
const sayFruit = sayFruitFactory()
sayFruit('🍇')
```

このコードの`Lexical Environment`は以下のようになる

![return function](../../images/2023-02-19-04.png)

- `sayFruit`関数は`sayFruitFactory`関数の中で作られた関数なので、`[[environment]]`プロパティには`sayFruitFactory`関数の`Lexical Environment`がセットされている
- `sayFruit`関数が呼び出されると、その外部`Lexical Environment`の参照は`[[environment]]`から取得される



### 冒頭のコードの解説
- これまでの説明を踏まえて、冒頭のコードの動作を解説する
- `sayFruit1`関数の`[[environment]]`プロパティにはグローバルの`Lexical Environment`がセットされている
- そのため、`sayFruit1`関数内で`food`にアクセスすると、`sayFruit1`関数の`Lexical Environment`には`food`がないので、`outerEnv` -> `[[environment]]`と辿り、グローバルの`Lexical Environment`で`food`を見つけることになる
- `sayFruit1`関数の直前に定義した`food`の`🍌`にはアクセスしない
``` js
let food = '🍎'
const sayFruit1 = () => console.log(food)

const sayFruit2 = () => {
    let food = '🍌'
    sayFruit1() // disp 🍎. not 🍌
}
sayFruit2()
```
`Lexical Environment`は以下のようになる


![summary](../../images/2023-02-19-05.png)

## まとめ
- 変数は`Lexical Environment`のプロパティとして管理される
- 関数呼び出しの度に`Lexical Environment`が作られる
- `outerEnv`には、関数呼び出し元の参照がセットされる
- 自身の`Lexical Environment`に変数がなければ、`outerEnv`を辿っていく
- 関数オブジェクトは`[[environment]]`プロパティを持っている
- `[[environment]]`プロパティは、その関数オブジェクトが作られた場所の`Lexical Environment`を指し示す
- これはEcmaScriptの仕様書に書いてあることでブラウザベンダーがどのように実装しているかは別の話とのこと

## 参考
- [javascript.info 変数スコープ、クロージャ](https://ja.javascript.info/closure)
- [超JavaScript 完全パック 2023 セクション7](https://www.udemy.com/course/javascript-complete/)

