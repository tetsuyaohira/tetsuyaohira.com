---
title: "TypeScriptのUnion型について"
date: "2024-07-21"
---

## はじめに

- TypeScriptのUnion型について学んだのでまとめます。

## TypeScriptのUnion型

### Union型の基本的な使い方

- Union型は、複数の型を`|`でつなげて1つの型として表現する機能
- たとえば、次のように書くことで、`number`型と`string`型のどちらかを受け付ける型を定義できる
- また、この表記は、3つ以上の型を`|`でつなげることも可能

```typescript
let value: number | string | boolean;
```

- プリミティブ型だけでなく、オブジェクト型、関数型やリテラル型などもUnion型として表現できる

```typescript
// オブジェクト型
type User = {
  name: string;
  age: number;
};
let alice: User | null;
// 関数型
type Callback = (error: Error | null, response: any) => void;
// リテラル型
let value: "foo" | "bar" | "baz";
```

### Union型を絞り込む

- Union型を使うと、複数の型を受け付ける変数を定義できるが、その変数を使うときには、どの型の値が入っているかを判定する必要がある
- TypeScriptは、Union型に対して、絞り込みの機能を提供している。
- たとえば、次のように書くことで、`value`が`number`型かどうかを判定できる

```typescript
let value: number | string;
if (typeof value === "number") {
  // valueはnumber型
} else {
  // valueはstring型
}
```

- また、`typeof`演算子を使って絞り込むこともできる

```typescript
let value: number | string;
if (typeof value === "number") {
  // valueはnumber型
} else {
  // valueはstring型
}
```

- Union型の絞り込みを行うときには、網羅性チェックが重要。
- 網羅性チェックは、Union型の全てのパターンを網羅しているかをチェックする処理のこと。
- 将来的に新しい型を追加した時に、新しい型に対する処理を忘れないようにする必要がある。
- switch文とdefault節における`never`型を使って網羅性チェックを行う

```typescript
let value: number | string;
switch (typeof value) {
  case "number":
    // valueはnumber型
    break;
  case "string":
    // valueはstring型
    break;
  default:
    const _exhaustiveCheck: never = value;
}
```

- `never`型は、その変数に値が入ることがないことを表す型。
- もし、`default`節に`never`型に代入しようとすると、コンパイルエラーが発生する。
- このようにすることで、Union型の全てのパターンを網羅しているかをチェックできる

## タグ付きUnion型

- タグ付きUnion型は、Union型にタグを付けて、Union型の各要素がどの型であるかを明示的に表現する方法。

### タグ付きUnion型の使い方

- タグ付きUnion型は、次のように書くことで定義できる

```typescript
type BuyingTask = {
  type: "buying";
  item: string;
  quantity: number;
};
type SellingTask = {
  type: "selling";
  item: string;
  price: number;
};
type PostingTask = {
  type: "posting";
  item: string;
  description: string;
};
type Task = BuyingTask | SellingTask | PostingTask;

const getTaskDescription = (task: Task): string => {
  switch (task.type) {
    case "buying":
      return `Buying ${task.quantity} ${task.item}`;
    case "selling":
      return `Selling ${task.item} for ${task.price}`;
    case "posting":
      return `Posting ${task.item} with ${task.description}`;
    default:
      const _exhaustiveCheck: never = task;
  }
};
```

- タグ付きUnion型を使うと、Union型の各要素がどの型であるかを明示的に表現でき、Union型の絞り込みがしやすくなる。

## Union型を用いる設計パターン

- TypeScriptにおいて、Union型を用いる設計パターンは随所に現れる
- Union型は「または」を表す型であり、「または」はビジネスロジックにもよく現れる概念
- そのため、Union型はTypeScriptプログラムの上から下まで幅広く使われる
- 以下に、Union型を用いる設計パターンの例をいくつか紹介する

### ないかもしれないデータ

- データがない場合を表現するために、Union型を使うことがある
- たとえば、次のように書くことで、`User`型か`null`型のどちらかを受け付ける型を定義できる

```typescript
type User = {
  name: string;
  age: number;
};
let user: User | null;
```

### 成功と失敗の表現

- 成功と失敗の結果を表現するために、Union型を使うことがある
- たとえば、次のように書くことで、`Result`型を定義できる
- `Result`型は、`success`プロパティが`true`の場合は`value`プロパティが`false`の場合は`error`プロパティが存在する
- このようにすることで、関数の戻り値が成功か失敗かを型で表現できる

```typescript
type Result<T, E> = {
  success: true;
  value: T;
} | {
  success: false;
  error: E;
};

const someOperation = (): Result<string, Error> => {
  try {
    // 成功時
    return {
      success: true,
      value: "success",
    };
  } catch (error) {
    // 失敗時
    return {
      success: false,
      error,
    };
  }
};

const result = someOperation();
if (result.success) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

## なぜ型にこだわるのか

- 型にこだわることは、プログラムの品質を向上させるために重要なこと
- 型にこだわることで、プログラムの挙動をより正確に表現できるようになる
- 型情報によって、プログラムの挙動を静的に検査することができるため、バグを早期に発見できる
- また、型にこだわることで、コードの理解性が向上し、メンテナンス性が高まる

## 参考文献
- [Software Design 2024年5月号 型を制する者はTypeScriptを制す もっとTypeScriptの力を引き出そう](https://gihyo.jp/magazine/SD/archive/2024/202405)
