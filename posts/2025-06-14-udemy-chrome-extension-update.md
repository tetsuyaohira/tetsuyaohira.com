---
title: "Udemy Chrome拡張機能の大型アップデート - Udemy Business対応と多言語サポート拡張"
date: "2025-06-14"
description: "Udemy翻訳・TTS Chrome拡張の大型アップデートを実施。Udemy Business対応、新たに10言語を追加、メモリリーク対策、UI/UX改善などで安定性と使いやすさを大幅向上"
tags: ["Chromeエクステンション", "Udemy", "JavaScript", "Web Speech API", "翻訳", "音声合成", "国際化", "TTS", "UX改善"]
---

## はじめに

- 2023年4月に作成したUdemy用のChrome拡張機能「[Udemy translate & speech](https://chromewebstore.google.com/detail/udemy-translate-speech/deajnmcnjlonmjkaibbiflnmihlmbdbc?hl=ja&utm_source=ext_sidebar)」に大型アップデートを実施した
- 主にユーザーからの要望に応えるアップデートで、Udemy Business対応と多言語サポートの大幅拡張を行った
- Chrome Web Storeでのレビューやユーザーフィードバックを基に優先順位を決めて開発を進めた

## 対応内容

### Udemy Business対応

- **課題**: Chrome Web Storeのレビューで複数のユーザーがUdemy Businessへの対応を求めていた
- **解決策**: manifest.jsonのmatchesパターンを拡張
  - 従来: `"https://www.udemy.com/course/*"`のみ
  - 更新後: `"https://*.udemy.com/course/*"`のワイルドカード対応
- **結果**: 企業向けUdemy Businessのサブドメインでも拡張機能が動作するようになった

### 言語サポートの大幅拡張

- **追加言語**: 10言語を新規サポート
  - タイ語、オランダ語、スウェーデン語、ノルウェー語、デンマーク語
  - ヘブライ語、ギリシャ語、チェコ語、ハンガリー語、ポーランド語
- **言語順序の最適化**: 一般的なWebサイトの慣例に従い、使用人口や地域を考慮した順序に再配置

### 安定性の向上

- **メモリリーク対策**
  - `setInterval`にタイムアウト機能を追加（最大60回試行で30秒タイムアウト）
  - 無限ループを防ぐためのmaxAttempts設定を実装
- **エラーハンドリング強化**
  - ネットワークリクエスト失敗時の適切な処理
  - Speech Synthesis "not-allowed"エラーの対策（動画再生中のみ音声合成実行）
- **イベントリスナー管理**: 重複登録を防ぐためのクリーンアップ処理を追加

### UI/UXの改善

- **フォントサイズ調整機能**: 字幕表示のフォントサイズをリアルタイムで調整可能
- **ダブルクリック翻訳切り替え**: 字幕エリアのダブルクリックで翻訳ON/OFF切り替え
- **デザイン統一**: スライダーコントロールの見た目と配置を統一

## 技術的な詳細

### ドメイン対応の実装

```json
{
  "content_scripts": [
    {
      "matches": [
        "https://www.udemy.com/course/*",
        "https://*.udemy.com/course/*"
      ],
      "js": ["content.js"],
      "css": ["styles.css"]
    }
  ]
}
```

### 言語定義の構造

```typescript
export const LANGUAGES: Language[] = [
  { translate: 'ja', speak: 'ja-JP' }, // 日本語
  { translate: 'th', speak: 'th-TH' }, // タイ語
  { translate: 'nl', speak: 'nl-NL' }, // オランダ語
  // ... 他の言語
]
```

### エラー処理の改善例

```typescript
async function getElementByClassName(className: string) {
  return new Promise((resolve, reject) => {
    let attemptCount = 0
    const maxAttempts = 60 // 30秒でタイムアウト
    
    const intervalId = setInterval(() => {
      attemptCount++
      const element = document.querySelectorAll(`[class^="${className}"]`)[0]

      if (element !== null && element !== undefined) {
        clearInterval(intervalId)
        resolve(element)
      } else if (attemptCount >= maxAttempts) {
        clearInterval(intervalId)
        reject(new Error(`Element not found after 30 seconds`))
      }
    }, 500)
  })
}
```

## 成果

- **ユーザビリティ向上**: Udemy Business利用企業でも拡張機能が使用可能になった
- **国際化対応**: 対応言語が大幅に増え、より多くの国のユーザーが利用可能
- **安定性向上**: メモリリークやエラーによる動作停止の問題を解決
- **ユーザーエクスペリエンス**: より直感的で使いやすいインターフェースを実現

## リンク

- [Chrome Web Store](https://chromewebstore.google.com/detail/udemy-translate-speech/deajnmcnjlonmjkaibbiflnmihlmbdbc?hl=ja&utm_source=ext_sidebar)
- [GitHub Repository](https://github.com/tetsuyaohira/udemy-translate-speech)