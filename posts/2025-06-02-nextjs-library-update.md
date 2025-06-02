---
title: "Next.js 12から14へ！段階的ライブラリアップデートの記録"
date: "2025-06-02"
---

## はじめに

約2年半放置していたNext.jsブログサイトのライブラリをアップデートした。Next.js 12.2.5から14.2.16への移行をはじめ、React、TypeScript、TailwindCSSなど主要ライブラリをすべて最新版に更新。段階的アプローチで安全に進めた過程を記録する。

## なぜアップデートが必要だったのか

- **セキュリティ**: 19個の脆弱性（12個がmoderate、5個がhigh、2個がcritical）
- **パフォーマンス**: 新しいバージョンでは大幅な高速化
- **開発体験**: 最新の機能や改善された開発ツール
- **将来性**: 古いバージョンのサポート終了に備える

## アップデート戦略：4つのフェーズ

リスクを最小限に抑えるため、段階的アプローチを採用した。

### Phase 1: 安全なアップデート
影響が小さく、破壊的変更が少ないライブラリから開始。

**更新内容:**
- TypeScript: 5.0.2 → 5.8.3
- react-syntax-highlighter: 15.5.0 → 15.6.1
- @types/node: 18.15.11 → 20.12.0

この段階では問題なくビルドが通り、スムーズに進行した。

### Phase 2: React関連ライブラリ
React本体は18系のまま、周辺ライブラリのみ更新。

**更新内容:**
- react-markdown: 8.0.5 → 10.1.0
- React & React DOM: 18.2.0のまま（安定性重視）

react-markdownのメジャーアップデートでは、APIの変更があったが、影響は限定的だった。

### Phase 3: Next.jsフレームワーク（最大の山場）
最も大きな変更となるNext.jsの更新。

**更新内容:**
- Next.js: 12.2.5 → 14.2.16
- eslint-config-next: 12.2.5 → 14.2.16
- eslint: 8.22.0 → 8.57.0

**主な変更点:**
1. `next export`コマンドの廃止 → `output: 'export'`設定に移行
2. Linkコンポーネントの構文変更（`<Link><a>...</a></Link>` → `<Link>...</Link>`）
3. 型定義の改善（GetStaticProps、AppPropsなど）

### Phase 4: TailwindCSS v4への移行
設定方法が大きく変わったTailwindCSSの更新。

**更新内容:**
- TailwindCSS: 3.2.7 → 4.1.8
- PostCSSプラグインの変更
- prettier: 2.8.4 → 3.3.0（依存関係のため）

**設定の変更:**
- `tailwind.config.js`が不要に
- `@tailwind`ディレクティブ → `@import "tailwindcss"`
- Oxide新エンジンで5倍高速化

## 遭遇した問題と解決方法

### 1. react-markdown v10でのclassName問題
```tsx
// 変更前
<ReactMarkdown className="prose mt-5">

// 変更後
<div className="prose mt-5">
  <ReactMarkdown>
```

### 2. code関数のinlineプロパティ廃止
```tsx
// 変更前
code({ node, inline, className, children, ...props }) {
  return !inline && match ? (

// 変更後
code({ node, className, children, ...props }: any) {
  return match ? (
```

### 3. リンクのグローバルスタイル問題
```css
/* 変更前：すべてのリンクに適用 */
a { @apply text-blue-600; }

/* 変更後：記事内のリンクのみ */
.prose a { @apply text-blue-600; }
```

## アップデートの成果

- **ビルド速度**: TailwindCSS v4のOxideエンジンで体感できる高速化
- **型安全性**: TypeScript 5.8の改善された型チェック
- **保守性**: 最新版による長期的なサポート
- **開発体験**: より良いエラーメッセージとツールサポート

## 今後の課題

- Next.js Imageコンポーネントへの移行（画像最適化）
- React 19へのアップデート（Next.js 15が必要）
- App Routerへの移行検討（現在はPage Router使用）
- Node.js v22との互換性確認

## まとめ

段階的アプローチにより、大規模なアップデートを安全に完了できた。一度に全てを更新するのではなく、影響範囲を限定しながら進めることで、問題の特定と解決が容易になる。

定期的なメンテナンスの重要性を改めて実感。今後は半年に一度はライブラリの状態を確認し、小規模なアップデートを継続的に行っていく予定だ。

## 参考情報

- [Next.js 14 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-14)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
