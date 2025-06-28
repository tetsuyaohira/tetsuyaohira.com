---
title: "Udemyのコンテンツの字幕を翻訳し合成音声で読み上げるChrome拡張を作りました"
date: "2023-04-29"
description: "Udemyの英語字幕をリアルタイムで日本語翻訳し、合成音声で読み上げるChromeエクステンションを開発。Web Speech APIとGoogle翻訳を活用"
tags: ["Chromeエクステンション", "JavaScript", "Web Speech API", "Google翻訳", "Udemy", "翻訳", "音声合成"]
---

## はじめに

- 最近プログラミングの勉強にUdemyという動画サービスを使ってプログラミングの勉強をしている
- プログラミングに関するコンテンツは圧倒的に英語が多い
- 英語のコンテンツでは基本的に英語の字幕を見ながら動画を見ることになる
- 字幕を読みながらプログラミングの動画を見るのは大変で日本語の動画を見ている時と比べ、動画を見るスピードが遅くなるし、集中力も切れる
- 英語の字幕をGoogle翻訳で翻訳して読み上げてくれるChrome拡張を作った
- Chrome Web StoreのURL
  - [Udemy translate & speech](https://chrome.google.com/webstore/detail/udemy-translate-speech/deajnmcnjlonmjkaibbiflnmihlmbdbc?hl=ja&authuser=0)

![2023-04-29-01.png](/images/2023-04-29-01.png)

## 実装面

- GitHub URL
    - [https://github.com/tetsuyaohira/udemy-translate-speech](https://github.com/tetsuyaohira/udemy-translate-speech)
- 字幕は`class`属性が同じ`div`要素に書かれているので、その`div`要素を取得して、その中身のテキストを取得
- 翻訳は`Google翻訳`のAPIキー不要のエンドポイントがありそれを使用
    - `Found a Google Translate endpoint that doesn't require an API key.`
      - [https://github.com/ssut/py-googletrans/issues/268](https://github.com/ssut/py-googletrans/issues/268)
- 読み上げは`Web Speech API`の`SpeechSynthesis`を使用
    - [SpeechSynthesis](https://developer.mozilla.org/ja/docs/Web/API/SpeechSynthesis)
    - 以下のコードだけで読み上げてくれる
      ```js
      const synth = window.speechSynthesis
      const utterThis = new SpeechSynthesisUtterance()
      utterThis.text = 'こんにちは'
      utterThis.pitch = 1
      utterThis.volume = 1
      utterThis.rate = 1
      utterThis.lang = 'ja-JP'
      synth.speak(utterThis)
      ```

## 終わりに

- `Web Speech API`は簡単な実装で読み上げができる。他のアプリでも使ってみたい
- 今後の予定
    - 翻訳サービスを`Google翻訳`と`DeepL翻訳`選べるようにする
        - `DeepL翻訳`の場合は、APIキーが必要なので、その辺りの設定をChrome拡張のオプションページで行えるようにする
    - 翻訳した文字列を動画内に表示する機能を追加する
        - これは、動画を見ながら翻訳した文字列を見ることで、動画の内容を理解しやすくするため
