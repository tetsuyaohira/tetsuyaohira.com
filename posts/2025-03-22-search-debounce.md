---
title: "Next.jsの検索フォームにデバウンスを実装する"
date: "2025-03-22"
description: "Next.jsで検索フォームのパフォーマンスを向上させるデバウンス処理を実装。useEffectとuseStateを使ったカスタムフックで不要なAPIリクエストを削減しUXを改善"
tags: ["Next.js", "React", "デバウンス", "useEffect", "検索フォーム", "パフォーマンス最適化", "カスタムフック", "UX"]
---

## はじめに

アプリケーションで入力したテキストから検索する機能を実装する際、ユーザーがキーボード入力するたびに検索処理を実行すると、無駄なリクエストが発生したり、UIがちらつくなどの問題が発生する。
特にサーバーサイドの検索処理に時間がかかる場合、この問題は顕著になる。
実装中にこの問題に直面し、デバウンス処理で解決したため、その知見を記事にまとめた。

## デバウンスとは

デバウンス（Debounce）とは、連続して発生するイベントを一定時間内にまとめ、最後のイベント発生から指定時間が経過した後に一度だけ処理を実行する技術である。
検索フォームに適用すると、ユーザーがタイプを止めてから一定時間（例：500ms）経過した後に検索処理を実行することで、不要なリクエストを削減できる。

例えば、ユーザーが「プロジェクト管理」と入力する場合：

- デバウンスなし🙅：「プ」「プロ」「プロジ」...と1文字入力するごとに検索処理が実行される
- デバウンスあり🙆：ユーザーが「プロジェクト管理」と入力し終えた後、一定時間（例：500ms）経過してから1回だけ検索処理が実行される

## デバウンスしない場合の問題点

上記にも述べた通り、デバウンスを実装しない検索フォームには、以下のような問題がある：

1. **サーバ負荷の増大**: ユーザーの入力ごとにAPIリクエストが発生し、サーバーに不必要な負担がかかる
2. **ネットワーク帯域の浪費**: 頻繁なリクエストにより、帯域幅を無駄に消費する
3. **UXの低下**: 連続したリクエストによりUIがちらつく、レスポンスが遅延するなど、ユーザー体験が劣化する
4. **不完全な検索結果**: 入力途中の文字列で検索が実行されるため、ユーザーが求める検索結果と乖離する場合がある
5. **レート制限の問題**: 外部APIを使用する場合、短時間に多くのリクエストを送信することでレート制限に達する可能性がある

## デバウンスを実装する

Next.jsのクライアントコンポーネントでデバウンスを実装する。
以下のコードは、プロジェクト検索フォームにデバウンスを実装する例である：

```tsx
// 基本的な状態管理の設定
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

// 入力ハンドラー - ユーザー入力を通常の状態に保存
const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchTerm(value);
};

// デバウンス効果を実装
useEffect(() => {
  // 指定した遅延時間後に実行するタイマーを設定
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000); // 1秒の遅延

  // クリーンアップ関数 - コンポーネントのアンマウント時や依存配列の値が変更された時に実行
  return () => {
    clearTimeout(timer); // 前のタイマーをキャンセル
  };
}, [searchTerm]); // searchTermが変更されるたびに実行

// デバウンスされた検索語が変更されたときに検索を実行
useEffect(async () => {
  const searchResults = await searchProjects(debouncedSearchTerm, limit, 1);
}, [debouncedSearchTerm]);
```

検索入力フィールドの実装例：
```tsx
<div>
  <input
    type='text'
    value={searchTerm}
    onChange={handleSearch}
  />
</div>
```

## デバウンスを実装した際の問題点

- 実装中に以下の問題に遭遇した
- **キー入力の入力途中で検索が行われてしまう**：タイマーをキャンセルせず、タイマーを設定するだけだと、入力が連続していても一定時間後に検索が実行されてしまう
- **連続入力の場合は前のタイマーをキャンセルして新しいタイマーをセットするよう修正**：この問題を解決するために、`useEffect` のクリーンアップ関数で `clearTimeout`を使って前のタイマーをキャンセルし、新しいタイマーをセットするパターンを実装した。これにより、最後のキー入力から指定時間が経過した場合にのみ検索が実行される

修正後の重要なコード部分：

```tsx
useEffect(() => {
  // 新しいタイマーを設定
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000);

  // 次の状態更新前に前のタイマーをクリア
  return () => {
    clearTimeout(timer);
  };
}, [searchTerm]);
```

## デバウンスをカスタムフックに切り出したコード例

デバウンスは検索だけでなく、ウィンドウのリサイズイベント、スクロールイベントなど、頻繁に発生するイベント処理に広く適用できるため、デバウンス処理のカスタムフックを作成しておくと再利用性が向上する。
カスタムフックを使用することで、デバウンスロジックを再利用可能な形に抽出できる。以下に、デバウンスのためのカスタムフック`useDebounce` の実装例を示す：

```ts
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  // デバウンスされた値の状態
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 指定された遅延後に値を更新するタイマーをセット
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数：コンポーネントのアンマウント時や
    // 依存値が変更された場合に前のタイマーをキャンセル
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

カスタムフックを使った実装例：

```tsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 1000);

const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
};

// デバウンスされた検索語が変更されたときに検索を実行
useEffect(async () => {
  const searchResults = await searchProjects(debouncedSearchTerm, limit, 1);
  // 検索結果をstateに保存
}, [debouncedSearchTerm]);
```

## まとめ

デバウンス技術を検索フォームに適用することで、以下のメリットが得られる：

1. **サーバー負荷の軽減**：不必要なAPIリクエスト数を大幅に削減できる
2. **パフォーマンスの向上**：必要な処理だけを実行するため、アプリケーション全体のパフォーマンスが向上する
3. **ユーザー体験の改善**：スムーズな検索体験を提供できる
4. **適切な検索結果**：ユーザーが入力を完了した後に検索が実行されるため、より正確な検索結果が得られる