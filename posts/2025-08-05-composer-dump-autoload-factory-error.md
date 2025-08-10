---
title: "LaravelのPHPUnitテストで`Factory not found`エラーが`composer dump-autoload`で解決した話"
date: "2025-08-05"
description: "LaravelのPHPUnitテストでFactoryクラスが見つからないエラーが発生。composer dump-autoloadで解決した原因と、Composerオートローダーの仕組みを解説"
tags: ["Laravel", "PHP", "Composer", "PHPUnit", "テスト", "オートローダー", "エラー解決", "トラブルシューティング"]
---

## 事象
- LaravelのPHPUnitテストを実行時にエラーが発生する
- 他のテストでは同じFactoryクラスが正常に動作している

## エラーメッセージ
```bash
1) Tests\Feature\Admin\ExampleControllerTest::正常なレスポンスが返ることを確認
Error: Class "Database\Factories\Domain\Models\ExampleModelFactory" not found

/app/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Factories/Factory.php:833
/app/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Factories/HasFactory.php:19
/app/tests/Feature/Admin/ExampleControllerTest.php:35
```

## 状況の詳細
- `ExampleModel::factory()->create()`でFactoryクラスが見つからない
- ファイル自体は`database/factories/domain/models/ExampleModelFactory.php`に存在する
- 他の複数のテストファイルでも同様のエラーが発生する
- 既存のテストファイルでは同じコードが動作している

```php
// エラーが発生するコード
ExampleModel::factory()->create([
    'user_id' => $this->user_id,
    'stat
]);
```

## 解決方法
```bash
composer dump-autoload
```

上記コマンドを実行後、全てのテストが正常に動作するようになった。

## 原因の解説

### Composerオートローダーとは
- Composerが提供するクラス自動読み込み機構
- クラス名とファイルパスのマッピング情報を管理
- `composer.json`の設定に基づいてマッピングを生成

### なぜエラーが発生したか
1. **オートローダーのマッピングが古い状態**
   - 新しいファクトリーファイルが追加された
   - Composerのオートローダーがそのファイルを認識していない

2. **PSR-4設定の未反映**
```json
// composer.json
"autoload": {
    "psr-4": {
        "Database\\Factories\\": "database/factories/"
    }
}
```

3. **キャッシュの問題**
   - 開発中のファイル構造変更
   - オートローダーのキャッシュが古い情報を保持

### composer dump-autoloadが解決した理由

#### 1. マッピングの再生成
```php
// vendor/composer/autoload_psr4.php (再生成後)
'Database\\Factories\\Domain\\Models\\' => array($baseDir . '/database/factories/domain/models'),
```

#### 2. クラスマップの更新
```php
// vendor/composer/autoload_classmap.php
'Database\\Factories\\Domain\\Models\\ExampleModelFactory' => 
    $baseDir . '/database/factories/domain/models/ExampleModelFactory.php'
```

#### 3. キャッシュクリア
- 古いオートローダー情報をクリア
- 現在のファイル構造を再スキャン
- 正確なマッピングを再構築

## まとめ
- `composer dump-autoload`は新しいクラスファイル追加後の必須作業である
- オートローダーの仕組みを理解することで、類似エラーの迅速な解決が可能になる
- 開発環境でのクラス読み込み問題は、多くの場合オートローダーの再生成で解決する
- 複数のテストで同じエラーが発生する場合は、環境全体の問題として捉える必要がある

Laravel開発において、ファクトリーやモデルクラスを新規追加した際は、テスト実行前に`composer dump-autoload`を実行する習慣をつけることが重要である。