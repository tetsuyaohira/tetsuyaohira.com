---
title: "PHPのjson_encodeで歯抜け配列がオブジェクトになる理由と対策"
date: "2025-12-19"
description: "PHPのjson_encodeは添字が連番でない配列をオブジェクトとして出力する。配列とオブジェクトの違い、再現コード、array_valuesでの解決方法を整理"
tags: ["PHP", "JSON", "json_encode", "配列", "バグ調査"]
---

## 事象
- 歯抜け添字の配列はJSON変換後に連想配列（JSONではオブジェクト）になる
- 連番添字の配列はJSON変換後に配列になる

## 添字が歯抜けている場合
```php
$items = [
  0 => ['key' => 'name'],
  1 => ['key' => 'post_code'],
  2 => ['key' => 'address'],
  3 => ['key' => 'contact'],
  4 => ['key' => 'age'],
  // 5〜7が抜けている（歯抜け添字）
  8 => ['key' => 'previous_place_of_stay'],
  9 => ['key' => 'next_place_of_stay'],
];

echo json_encode($items, JSON_UNESCAPED_UNICODE) . PHP_EOL;
```

出力
```json
{
  "0": {"key": "name"},
  "1": {"key": "post_code"},
  "2": {"key": "address"},
  "3": {"key": "contact"},
  "4": {"key": "age"},
  "8": {"key": "previous_place_of_stay"},
  "9": {"key": "next_place_of_stay"}
}
```

## 添字が連番の場合
```php
$items = [
  0 => ['key' => 'name'],
  1 => ['key' => 'post_code'],
  2 => ['key' => 'address'],
  3 => ['key' => 'contact'],
  4 => ['key' => 'age'],
  5 => ['key' => 'previous_place_of_stay'],
  6 => ['key' => 'next_place_of_stay'],
];

echo json_encode($items, JSON_UNESCAPED_UNICODE) . PHP_EOL;
```

出力
```json
[
  {"key": "name"},
  {"key": "post_code"},
  {"key": "address"},
  {"key": "contact"},
  {"key": "age"},
  {"key": "previous_place_of_stay"},
  {"key": "next_place_of_stay"}
]
```

## 原因
- `json_encode`は**添字が連番ではない配列**を「オブジェクト」として扱う
- **歯抜けキー**の配列はJSON化時にオブジェクトとして出力される

## 解決方法
`array_values`で添字を詰めてから返す。

```php
$items = array_values($items);

echo json_encode($items, JSON_UNESCAPED_UNICODE) . PHP_EOL;
```

出力
```json
[
  {"key": "name"},
  {"key": "post_code"},
  {"key": "address"},
  {"key": "contact"},
  {"key": "age"},
  {"key": "previous_place_of_stay"},
  {"key": "next_place_of_stay"}
]
```

## まとめ
- 歯抜け添字の配列はJSON変換後に連想配列（オブジェクト）になる
- 連番添字の配列はJSON変換後に配列になる
- 歯抜け添字の配列を配列として返すには`array_values`で整形する
