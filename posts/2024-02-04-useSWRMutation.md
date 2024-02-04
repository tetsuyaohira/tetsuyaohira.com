---
title: "useSWRMutationのtriggerに複数の引数を渡す"
date: "2024-02-04"
---

## はじめに
- `useSWRMutation`は、`useSWR`と`mutate`を組み合わせたカスタムフックで、データの更新処理を`useSWR`と同じように扱えるようにするもの
- このフックは、`trigger`という関数を提供しており、任意のタイミングでデータの更新を行える
- `trigger`の引数は、`trigger(arg, options)`のように渡す

## 発生した問題
- `trigger`の実行時に、複数の引数を渡したいという要件があった
- 例えば、変更画面での更新処理の際に、変更前のデータと変更後のデータを渡したいという要件
- しかし、`trigger`は単一の引数しか受け取れないため、複数の引数を渡すことができないため、どうするか悩んでいた

## 解決策
- `trigger`の引数に`beforeUser`と`afterUser`をまとめた`args`オブジェクトを渡すことで、複数の引数を渡すことができる
```typescript
async function sendRequest(url, { arg }: { arg: { beforeUser: User,afterUser: User } }) {
  // 更新処理
  //...
}

const App = async () => {

  const { trigger,isMutating } = useSWRMutation('api/endpoint', sendRequest)
  
  const beforeUser = { id: 1, name: 'Taro' }
  const afterUser = { id: 1, name: 'Jiro' }

  return (
    <button
      disabled={isMutating}
      onClick={async () => await trigger({ beforeUser,afterUser })}
    >
      Update User
    </button>
  )
}
```
- `trigger`に渡した引数は、`sendRequest`の第二引数に渡される

## まとめ
- `useSWRMutation`の`trigger`に複数の引数を渡す方法を紹介した

## 参考
- [useSWRMutation](https://swr.vercel.app/ja/docs/mutation#useswrmutation)
