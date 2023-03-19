---
title: "GitHubへのCommitをトリガーにReactのBuild、S3への配置、Cloudfrontのキャッシュクリアまでを自動化する"
date: "2023-03-12"
---

このブログのデプロイを自動化しました。

## 処理の流れ
1. `GitHub`へのPushをトリガーに、`CodePipeline`を実行
2. `CodePipeline`は、`CodeBuild`を実行
3. `CodeBuild`は`buildspec.yml`に従って処理を実行
   1. `React`プロジェクトを`Build`
   2. `Build`したファイルを`S3`へ配置
   3. `Cloudfront`のキャッシュをクリア
4. `CodeBuild`は、`Codepipeline`に結果を通知

## 構築手順
### `CodePipeline`と`CodeBuild`の作成
1. `CodePipeline`を開き、`パイプラインの作成`をクリック
2. パイプライン名 `blog`
3. ソースプロバイダーに`GitHub(バージョン2)`を選び、リポジトリとブランチを選択
4. `ソースコードの変更時にパイプラインを開始する`のチェックが入っていることを確認
5. ビルドプロバイダーに`AWS CodeBuild`を選択
6. `プロジェクトを作成する`を選択
   1. プロジェクト名に`blog`を入力
   2. オペレーションシステムに`Amazon Linux2`を選択
   3. ランタイムに`Standard`を選択
   4. イメージに`aws/codebuild/amazonlinux2-x86_64-standard:4.0`を選択
   5. 環境変数に`S3_BUCKET_NAME`を追加
   6. 環境変数に`CLOUDFRONT_DISTRIBUTION_ID`を追加
   7. その他の設定はデフォルトのまま`CodePipelineに進む`をクリック
7. パイプラインの作成ウィザードに戻ってくるので`次に`をクリック
8. `導入段階をスキップ`を選択する。デプロイは`CodeBuild`で行うため、`CodePipeline`のデプロイは不要
9. `パイプラインを作成`をクリック

### `CodeBuild`を実行するロールに`S3`と`Cloudfront`へのアクセス権限を付与
1. `IAM`を開く
2. `codebuild-blog-service-role`という名前のロールを選択
3. `許可を追加`の`ポリシーのアタッチ`をクリック
4. `AmazonS3FullAccess`を検索して選択
5. `AmazonCloudFrontFullAccess`を検索して選択

### `GitHub`のリポジトリに`buildspec.yml`を追加
1. `buildspec.yml`を追加
    ``` bash
    touch buildspec.yml
    ```
2. `buildspec.yml`に以下を追加
    ``` yaml
    version: 0.2
    phases:
      build:
        commands:
          - npm install
          - npm run build
      post_build:
        commands:
          - aws s3 sync out s3://${S3_BUCKET_NAME}
          - aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths '/*'
    ```
3. コミットしてプッシュ


以上で、GitHubへのPushをトリガーに、AWS Codepipelineを実行する設定は完了です。
`main`ブランチにPushすると、コンテンツの配信が自動的に行われます。