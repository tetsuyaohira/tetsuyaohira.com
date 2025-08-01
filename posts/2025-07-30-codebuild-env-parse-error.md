---
title: 'AWS CodeBuildで環境変数にスペースを含む場合のパースエラー対処法'
date: '2025-07-30'
tags: [ 'AWS', 'CodeBuild', 'Docker', '環境変数' ]
draft: false
summary: 'CodeBuildでアプリをビルドする際、環境変数にスペースが含まれているとdotenvのパースエラーが発生する問題とその解決方法'
---

## 問題の概要

AWS CodeBuildでアプリケーションをDockerビルドする際、環境変数にスペースが含まれていると、以下のようなエラーが発生した。

```bash
16.47 The environment file is invalid!
16.47 Failed to parse dotenv file. Encountered unexpected whitespace at [スペースあり 環境変数値].
16.48 Script @php artisan package:discover --ansi handling the post-autoload-dump event returned with error code 1
```

## エラーの原因

このエラーは、`.env`ファイルの環境変数値にスペースが含まれているにもかかわらず、クォートで囲まれていないことが原因

### エラーになる例

```env
APP_NAME=スペースあり 環境変数値
```

上記のように、値に日本語やスペースが含まれる場合、dotenvパーサーが正しく解析できない

## 解決方法

### 1. ダブルクォートで囲む

最も簡単な解決方法は、値をダブルクォートで囲むこと

```env
APP_NAME="スペースあり 環境変数値"
```

### 2. シングルクォートで囲む

シングルクォートでも同様に動作します

```env
APP_NAME='スペースあり 環境変数値'
```

## CodeBuildでの環境変数設定

AWS CodeBuildの環境変数設定画面では、以下のように設定します

- **名前**: `APP_NAME`
- **値**: `"スペースあり 環境変数値"`（ダブルクォート込み）
- **タイプ**: プレーンテキスト

## まとめ

AWS CodeBuildでビルドする際、環境変数にスペースを含む場合は、必ずクォートで囲むこと。
これは`.env`ファイルの仕様によるもの。