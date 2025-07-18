---
title: "このブログサイトのデプロイをAmplifyに変更した"
date: "2025-03-31"
description: "Next.jsブログのデプロイ先をS3+CloudFrontからAWS Amplifyに移行。設定のシンプル化とCI/CDパイプラインの簡略化で運用負荷を大幅に減らせた移行体験を報告"
tags: ["AWS", "Amplify", "Next.js", "S3", "CloudFront", "CodePipeline", "CodeBuild", "デプロイ", "CI/CD"]
---

## はじめに

- 2025年3月31日、デプロイ先をAmplifyに変更した
- これまでは、S3+CloudFrontで[デプロイ](../2023-03-12-auto-deploy/)していたが、 別件でAmplifyを使用し、とても便利だったのがきっかけ
- 現状の構成のままでも問題はなかったが、Amplifyを使うことで、デプロイのための設定を減らせるため変更した

## ビルドとデプロイの流れ
- これまでのフロー
    - GitHubコミット → CodePipelineが起動 → CodeBuildが起動 → Next.jsプロジェクトのビルと → S3に展開 → CloudFrontのキャッシュクリア
- Amplifyに変更したフロー
    - GitHubコミット → Amplifyが起動 → Next.jsプロジェクトのビルドと展開

## 実際に移行してみて感じたこと
### 良かった点
1. 設定がシンプル 
   - Amplifyでは、デプロイ設定をすべてAmplifyコンソールで管理できる。これにより、以下の手間が省けました 
     - CodePipeline/CodeBuildの設定 
     - S3バケットの準備
     - CloudFrontの設定

### 懸念点

- 静的サイトの場合、S3+CloudFront配信にはパフォーマンス的な強みがありそう
- しかし、Amplifyでも体感上の速度低下などの問題は感じない
- 運用がシンプルになる反面、Amplifyを使うことで若干コストが上がる可能性がある

## 振り返り

- 使用するAWSサービスを減らせたのは認知負荷が減るので良い