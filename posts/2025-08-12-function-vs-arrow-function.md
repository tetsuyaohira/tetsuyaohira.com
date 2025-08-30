---
title: 'JavaScriptのfunction宣言とアロー関数、どう使い分ける？'
date: '2025-08-12'
tags: ['JavaScript', 'TypeScript', 'Best Practices']
---

## アロー関数はかっこいいから全部アロー関数にしがちだが...

ES6でアロー関数が導入されてから、モダンなJavaScriptコードはアロー関数だらけになった。確かに`=>`という記法はスマートで、コードがモダンに見える。しかし、すべてをアロー関数で書くのが本当にベストプラクティスなのだろうか？

実は、従来の`function`宣言の方が適している場面も多い。今回は両者の違いと適切な使い分けについて整理してみた。

## 主な違い

### 1. ホイスティング（巻き上げ）

最も重要な違いの一つがホイスティングである。

```javascript
// function宣言：定義前でも呼び出せる
console.log(add(2, 3)); // 5

function add(a, b) {
  return a + b;
}
```

```javascript
// アロー関数：定義前に呼び出すとエラー
console.log(add(2, 3)); // ReferenceError: Cannot access 'add' before initialization

const add = (a, b) => {
  return a + b;
};
```

関数宣言はコード実行前に巻き上げられるため、定義の位置を気にせず使える。一方、アロー関数は変数と同じ扱いなので、定義前に使うことはできない。

### 2. thisの扱い

`this`の挙動は両者で大きく異なる。

```javascript
const obj = {
  name: 'Object',
  
  // function宣言：呼び出し元のthisを参照
  methodFunction: function() {
    console.log(this.name); // 'Object'
  },
  
  // アロー関数：レキシカルスコープのthisを参照
  methodArrow: () => {
    console.log(this.name); // undefined（グローバルのthis）
  }
};
```

アロー関数は`this`を束縛しない。定義時のスコープの`this`を継承する。これはイベントハンドラやコールバックで便利だが、メソッドとして使うと予期しない動作になることがある。

### 3. argumentsオブジェクト

```javascript
// function宣言：argumentsが使える
function sum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// アロー関数：argumentsは使えない
const sumArrow = () => {
  return Array.from(arguments); // ReferenceError: arguments is not defined
};
```

アロー関数では`arguments`オブジェクトが使えない。代わりにレスト構文（`...args`）を使う必要がある。

### 4. コンストラクタとしての使用

```javascript
// function宣言：コンストラクタとして使える
function Person(name) {
  this.name = name;
}
const person = new Person('Alice'); // OK

// アロー関数：コンストラクタとして使えない
const PersonArrow = (name) => {
  this.name = name;
};
const person2 = new PersonArrow('Bob'); // TypeError: PersonArrow is not a constructor
```

アロー関数は`new`演算子と一緒に使えない。

## 使い分けのガイドライン

### function宣言を使うべき場面

#### 1. トップレベルの関数・ユーティリティ関数
```javascript
// ヘルパー関数は明確にfunctionで定義
function calculateTax(price, rate) {
  return price * rate;
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}
```

独立した処理を行う関数は`function`宣言の方が意図が明確である。

#### 2. 再帰関数
```javascript
// 名前付き関数として自己参照しやすい
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}
```

#### 3. オブジェクトのメソッド（thisを使う場合）
```javascript
const counter = {
  count: 0,
  increment: function() {
    this.count++;
  }
};
```

### アロー関数を使うべき場面

#### 1. コールバック関数
```javascript
// 配列メソッドのコールバック
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);

// イベントリスナー
button.addEventListener('click', () => {
  console.log('Clicked!');
});

// Promise処理
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

#### 2. 高階関数の戻り値
```javascript
const createMultiplier = (factor) => {
  return (number) => number * factor;
};

const double = createMultiplier(2);
console.log(double(5)); // 10
```

#### 3. React Hooks
```javascript
const useCounter = () => {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  
  return { count, increment, decrement };
};
```

#### 4. thisを固定したいイベントハンドラ
```javascript
class Button {
  constructor() {
    this.clicked = false;
    
    // アロー関数でthisを固定
    this.handleClick = () => {
      this.clicked = true;
    };
  }
}
```

## 実践的な例：Server Actionでの使い分け

Next.jsのServer Actionで実際に使い分けた例を見てみる。

```typescript
'use server';

// メインのエクスポート関数はアロー関数（モダンな慣習）
export const fetchPlateauCities = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    // データ処理
    const cities = data.results
      .filter(isValidCity)
      .map(extractCityInfo);
    
    return { success: true, cities };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ヘルパー関数はfunction宣言（意図を明確に）
function isValidCity(dataset) {
  return dataset.name.includes('plateau-') && 
         dataset.name.match(/plateau-\d{5}-/);
}

function extractCityInfo(dataset) {
  const coordinates = extractCoordinates(dataset);
  return {
    id: dataset.id,
    name: dataset.name,
    coordinates
  };
}

// プライベートなユーティリティ関数
function extractCoordinates(dataset) {
  if (!dataset.spatial) return null;
  
  const spatial = JSON.parse(dataset.spatial);
  // 座標計算処理...
  return { latitude, longitude };
}
```

## スタックトレースでの見え方

デバッグ時の違いも重要である。

```javascript
// function宣言：関数名が表示される
function processData() {
  throw new Error('Something went wrong');
}
// Error: Something went wrong
//   at processData (file.js:2:9)

// アロー関数：変数名が表示される（現代のエンジンでは）
const processData = () => {
  throw new Error('Something went wrong');
};
// Error: Something went wrong
//   at processData (file.js:2:9)

// 無名のアロー関数：匿名として表示される
[1, 2, 3].map(() => {
  throw new Error('Something went wrong');
});
// Error: Something went wrong
//   at <anonymous> (file.js:2:9)
```

**注意：** 現代のJavaScriptエンジン（V8、SpiderMonkey等）では、変数に代入されたアロー関数でも変数名がスタックトレースに表示されることが多い。ただし、無名のアロー関数（コールバック等）では依然として`<anonymous>`と表示される場合がある。

## パフォーマンスの違い

実行速度に大きな違いはないが、メモリ使用量には若干の差がある。

```javascript
// function宣言：プロトタイプメソッドとして共有可能
function MyClass() {}
MyClass.prototype.method = function() {};

// アロー関数：インスタンスごとに作成される
class MyClass {
  method = () => {};  // 各インスタンスで新しい関数が作られる
}
```

大量のインスタンスを作る場合は、この違いが影響することもある。

## まとめ

アロー関数は確かにモダンで簡潔だが、すべてをアロー関数で書くのは適切ではない。

**使い分けの基本原則：**
- **独立した処理** → `function`宣言
- **コンテキストに依存する処理** → アロー関数

コードは動作するだけでなく、**意図が伝わる**ことが重要である。`function`宣言を見れば「これは独立したユーティリティ関数だ」と分かり、アロー関数を見れば「これはコールバックやイベントハンドラだ」と理解できる。

モダンなコードを書くことは大切だが、適材適所で使い分けることで、より読みやすく保守しやすいコードになる。かっこよさだけでなく、実用性も考慮した選択をしていきたい。

## 参考資料

- [MDN - Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN - Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [When (and why) you should use ES6 arrow functions — and when you shouldn't](https://www.freecodecamp.org/news/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26/)