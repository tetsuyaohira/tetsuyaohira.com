---
title: "技術書をポッドキャスト風音声に変換するNode.jsアプリケーション「TechTalkCast」を作成した"
date: "2025-06-04"
---

## はじめに

技術書を読む時間がない自分のために、ePubファイルをポッドキャスト風の自然な音声コンテンツに変換するNode.jsアプリケーション「TechTalkCast」を作成した。

## GitHubリポジトリ

[GitHubリポジトリ](https://github.com/tetsuyaohira/tech-talk-cast)

## アプリケーションの概要

TechTalkCastは以下の3つのステップで技術書をポッドキャストに変換する

1. **ePub → テキスト**: ePubファイルから章ごとにテキストを抽出
2. **テキスト → 会話調テキスト**: ChatGPT APIを使用して技術的内容をフランクな会話調に変換
3. **テキスト → 音声**: macOSの`say`コマンドとffmpegを使用してMP3/M4A形式の音声ファイルを生成

## 技術スタック

- **言語**: TypeScript
- **実行環境**: Node.js
- **音声合成**: macOS say command + ffmpeg
- **AI変換**: OpenAI GPT-4.1 mini
- **ファイル解析**: epub2 (npm package)
- **RSS生成**: 自作RSSジェネレーター

## 主な機能

### ePubファイルの解析と前処理

```typescript
// ePubファイルからの章抽出
hasHeadingTags(content: string): boolean {
    const h1Match = /<h1[^>]*>/i.test(content);
    const h2Match = /<h2[^>]*>/i.test(content);
    const h3Match = /<h3[^>]*>/i.test(content);
    return h1Match || h2Match || h3Match;
}
```

- h1/h2/h3タグを含まない著作権ページや目次ページは自動的に除外
- 章ごとにテキストファイルとして出力

### ChatGPT APIによる会話調変換

```typescript
private defaultModel = 'gpt-4.1-mini';
private defaultMaxLength = 500000; // 50万文字まで処理可能
```

- **GPT-4.1 mini**を使用してコストを削減（1冊約40円）
- 100万トークンのコンテキストウィンドウで長い章も分割せずに処理
- 技術的内容を「だ・である調」からフランクな「〜なんだよね」調に変換

### プロンプト設計の工夫

```markdown
- フランクで親しみやすい口調にしてください（例：「〜なんだよね」「って話」など）
- **絶対に敬語は使わないでください**（「〜です」「〜ます」「〜してください」は禁止）
- **一人称は「僕」で統一してください**
- **ソースコードは絶対に出力しないでください**（コードブロックや具体的なコードは一切禁止）
- コードの説明が必要な場合は「このコードは〜という処理をしている」のように概念的に説明してください
```

### チャプター付きM4A音声の生成

```typescript
// チャプター情報の埋め込み
chapters.forEach((chapter, index) => {
    const startMs = Math.floor(chapter.startTime * 1000);
    const endMs = Math.floor((chapter.startTime + chapter.duration) * 1000);
    metadataContent += `[CHAPTER]\n`;
    metadataContent += `TIMEBASE=1/1000\n`;
    metadataContent += `START=${startMs}\n`;
    metadataContent += `END=${endMs}\n`;
    metadataContent += `title=${chapter.title}\n\n`;
});
```

- ffmpegを使用してチャプター情報をM4Aファイルに埋め込み
- Podcast アプリやQuickTime Playerで章ごとのナビゲーションが可能

## 工夫した点

### API コストの最適化

- **GPT-4o**（$5/1M入力）から**GPT-4.1 mini**（$0.40/1M入力）に変更
- 1冊あたりの変換コストを約450円から約40円に削減（約90%削減）
- Batch APIを使用すればさらに50%削減可能

### ファイル名のスペース問題の解決

並列処理でスペースを含むファイル名がシェルコマンドでエラーを起こす問題を解決

```typescript
// 修正前（エラーの原因）
const tempTextFile = `${outputFile}.temp.txt`;

// 修正後（スペースを含まない固定ファイル名）
const tempTextFile = path.join(path.dirname(outputFile), 'combined_temp.txt');
```

### コンテンツの品質向上

- ソースコードの自動除去により音声での聞きやすさを向上
- 敬語から会話調への変換で親しみやすい雰囲気を実現
- 接続詞のバリエーション（「さて」「続いては」「それでは」など）で単調さを回避

### RSS フィード生成とポッドキャスト配信対応

```typescript
// S3 URLに対応したRSS生成
audioUrl: `${this.baseUrl}/audio/${fileName}`,
```

- 各書籍ごとに個別のRSSフィードを生成
- S3バケットでの配信を想定したURL構造
- Apple PodcastsやSpotifyでの配信に対応

## コマンドライン使用例

```bash
# 基本的な変換
npm run dev -- "./books/リーダブルコード.epub"

# GPT処理をスキップ（音声生成のみ）
npm run dev -- "./books/リーダブルコード.epub" --no-gpt

# 音声ファイル結合のみ実行
npm run dev -- "./books/リーダブルコード.epub" --combine-only
```

## 出力構造

```
output/
├── リーダブルコード/                    # 抽出されたテキスト
│   └── 01-Chapter_Title.txt
├── リーダブルコード_narrated/           # GPT変換後テキスト
│   └── narrated_01-Chapter_Title.txt
└── リーダブルコード_audio/              # 生成された音声ファイル
    ├── 01-Chapter_Title.mp3
    ├── リーダブルコード_完全版.m4a      # チャプター付き完全版
    └── リーダブルコード.rss.xml        # RSS フィード
```

## 成果と結果

- 「リーダブルコード」（約24万文字）を約1時間47分の音声コンテンツに変換
- 変換コスト：約40円（GPT-4.1 mini使用時）
- 26章のチャプター付きM4Aファイルとして出力
- 通勤時間や移動中に技術書の内容を効率的にインプット可能

## 今後の展開

- **自動アップロード機能**: S3への自動アップロードとポッドキャスト配信の自動化
- **多言語対応**: 英語技術書の日本語変換
- **音声品質向上**: 感情表現やイントネーションの改善
- **Web UI**: ブラウザからの簡単操作インターフェース

## LLMを活用した開発体験

このアプリケーションは**Claude Code（Anthropic）を使ったライブコーディング**で開発された。LLMとのペアプログラミングにより、わずか**1日で完成**させることができた。

### 開発プロセス

- **設計フェーズ**: 要件定義からアーキテクチャ設計まで、LLMとの対話で迅速に決定
- **実装フェーズ**: TypeScriptコードの生成、デバッグ、最適化をリアルタイムで実施
- **問題解決**: スペース文字によるシェルコマンドエラー、チャプター情報の埋め込み問題など、複雑な技術的課題も即座に解決

### 従来開発との比較

```markdown
従来の開発（推定）:
- 設計・調査: 2-3日
- 実装: 5-7日
- デバッグ・最適化: 2-3日
- 合計: 10-14日

LLM活用開発（実績）:
- 全工程: 1日
```

## 感想

ChatGPT APIの進化により、単なる音声読み上げではなく、実際に人が話しているような自然な会話調での技術書解説が実現できた。特にGPT-4.1 miniの登場により、コストを大幅に抑えながら高品質な変換が可能になったことは大きな成果である。

**しかし、最も衝撃的だったのは開発体験そのものである。** LLMとのペアプログラミングにより、従来なら2週間かかる複雑なアプリケーションを1日で完成させることができた。これは単なる効率化を超えて、**プログラミングというものの本質的な変化**を示している。

従来は「コードを書く」ことに多くの時間を費やしていたが、LLM時代では「何を作るか」「どう設計するか」といった**創造的思考により多くの時間を割ける**ようになった。エンジニアの役割は実装者から設計者・問題解決者へと大きくシフトしている。

技術書を「読む」から「聞く」へのパラダイムシフトと同様に、プログラミングも「書く」から「対話する」へのパラダイムシフトが起きている。この変化を実体験できたことは、アプリケーション開発以上に価値のある体験となった。

## 参考文献

- [GPT-4.1 miniモデル比較ドキュメント](https://docs.anthropic.com/ja/docs/about-claude/models/migrating-to-claude-4)
- [ffmpeg チャプター埋め込みドキュメント](https://ffmpeg.org/ffmpeg-formats.html#metadata-1)