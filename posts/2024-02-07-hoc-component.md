---
title: "HOC(Higher-Order Component)を使って共通処理をまとめる"
date: "2024-02-07"
description: "ReactのHOCパターンを使ってローディング状態やエラー処理などの共通処理を再利用可能なコンポーネントとしてラッピングする方法を紹介"
tags: ["React", "HOC", "Higher-Order Component", "TypeScript", "共通処理", "ローディング", "エラー処理"]
---

## はじめに
- Reactのコンポーネントでは、APIリクエスト中に`Loading...`を表示したり、エラーが発生した場合にエラーメッセージを表示するなどの処理が必要になる。
- コンポーネントごとに同じような処理を書くのは冗長。
- そこで、HOC（Higher-Order Component）を使って共通処理をまとめる方法について考えてみた。

## 実現方法
- `withLoading`というHOCを作成し、共通処理を記述する。
- `withLoading`は、`isLoading`プロパティが`true`の場合は`Loading...`を表示し、`false`の場合はラップされたコンポーネント（`WrappedComponent`）を表示。

```typescript
// withLoading.tsx
const withLoading = (WrappedComponent: React.FC) => (props) => {
  if (props.isLoading) {
    return <div>Loading...</div>;
  }
  if (props.error) {
    return <div>Error: {props.error.message}</div>;
  }
  return <WrappedComponent {...props} />;
}
```
## 使い方
- 以下の例では、MyComponentをwithLoadingでラップする。
- これにより、ローディング状態とエラー状態の表示をMyComponentから分離できる。
```typescript
// MyComponent.tsx
export const MyComponent = withLoading(({ data }) => {
  return <div>{data}</div>
})

// App.tsx
const App = () => {
  const { data, isLoading, error } = useSWR('api/endpoint', fetcher)
  return <MyComponent data={data} isLoading={isLoading} error={error} />
}
```
- `withLoading`を使用することで、他のコンポーネントでも共通処理を簡単に再利用できるようになる。

## まとめ
- HOCは、ローディング処理やエラー表示などの共通処理をコンポーネント間で再利用するための強力な手段。
- ロギングなど、他の共通処理にもHOCを利用することが可能。

## 参考
- [HOC(Higher Order Component)とは](https://ja.reactjs.org/docs/higher-order-components.html)
