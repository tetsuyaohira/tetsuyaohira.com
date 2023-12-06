---
title: "楽天ROOMに自動投稿するNode.jsアプリケーションを作成した"
date: "2023-12-05"
---

## はじめに

- ChatGPT APIの機能を活用して何か作りたいという思いから、このツールを作った
- 楽天ROOMは商品を紹介し、紹介ページ経由での商品購入がアフィリエイト収益につながる楽天のサービス
- このツールは、楽天APIから商品一覧を取得し、ChatGPT APIを使用して商品の紹介文を生成、そしてスクレイピングで自動投稿する。

## GitHubリポジトリ

[GitHubリポジトリ](https://github.com/tetsuyaohira/rakuten-room-auto-post)

## 使用したnpmライブラリ

- スクレイピング: `puppeteer`
- 定期実行: `cron`

## 工夫した点

- 商品紹介文の自動生成にはChatGPT APIを使用。英語でのロール指示を採用した理由は、英語の精度が高いため
    ```typescript
    // generateProductDescription.ts
    
    const ROLE_CONTENT = `Please write short, attractive, friendly sentences to post on Rakuten ROOM so that people will want to buy your products.
    - Please do not use "[ and ]" because they are garbled.
    - Please use pictograms.
    - Please add a relevant hashtag at the end of the sentence.
    - Please keep it within 350 characters.
    - Answer in the language asked.`;
    ```
  
- Modelは`gpt-3.5-turbo`を使用した。実行コストが安いため

- 楽天APIから取得した商品名や概要をプロンプトに入力し、効果的な紹介文を作成
    ```typescript
    // generateProductDescription.ts
    
    const catchcopy = '楽天APIから取得'
    const itemName = '楽天APIから取得'
    const itemCaption1000 = '楽天APIから取得'
    const prompt = `以下の商品を購入したくなるように魅力的にフレンドリーに短く書いてください。
      250字以内に収めてください。  
      以下、商品の特徴
      ${catchcopy} ${itemName}
      
      ${itemCaption1000}
      `
    ```

- 楽天ROOMに既に投稿済みの商品かどうかを判定し、不要なChatGPT APIの呼び出しを避けるよう工夫
  ```typescript
  // scrapeWebsite.ts
  
  // コレ！済みの場合は、処理を終了
  let modalElement = null
  try {
    await page.waitForSelector('.modal-dialog-container', {
      visible: true,
      timeout: 500
    })
    modalElement = await page.$('.modal-dialog-container')
  } catch (error) {
  }
  if (modalElement) {
    console.log('「すでにコレしている商品です」のため処理を終了')
    await browser.close()
    return
  }
  ```

- cronを使用して定期実行するように設定
  ```typescript
  // index.ts
  
  const job = new CronJob('0 0 9,12,18,21 * * *', () => {
    console.log('Start job:' + new Date().toLocaleString())
    main()
  })
  ```

- 実行時間によって投稿する商品ジャンルが変わる仕組みを実装
  ```typescript
  // getGenreIdsByTime.ts
  
  const genres: Genres = {
    9: ['100371', '100433'],  // 9時にジャンル「レディースファッション」、「インナー・下着・ナイトウェア」を投稿
    12: ['216131', '558885'], // 12時にジャンル「バッグ・小物・ブランド雑貨」、「靴」を投稿
    15: ['216129', '100533'], // 15時にジャンル「ジュエリー・アクセサリー」、「キッズ・ベビー・マタニティ」を投稿
    18: ['551167', '100804'], // 18時にジャンル「スイーツ・お菓子」、「インテリア・寝具・収納」を投稿
    21: ['558944', '100939']  // 21時にジャンル「キッチン用品・食器・調理器具」、「美容・コスメ・香水」を投稿
  }
  ```

## 成果

- 実施期間：2023/11/13 〜 2023/12/6
- 成果報酬: ¥2,839
- ChatGPT Cost: ¥576.50 ($3.92)
![2023-12-05-01.png](/images/2023-12-05-01.png)

## 感想

- 自動化の力とAIの可能性を実感した

## 参考

- [楽天商品ランキングAPI](https://webservice.rakuten.co.jp/documentation/ichiba-item-ranking)