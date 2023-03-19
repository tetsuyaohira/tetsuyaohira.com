---
title: "AWS Cloud9の作成で`Cloud9 could not connect to the EC2 instance. Please check your VPC configuration and network settings to troubleshoot the issue. Go to CloudFormation`エラーが発生する"
date: "2022-11-26"
---
## 事象
- AWS Cloud9の作成が失敗する

## エラーメッセージ
``` bash
Unable to access your environment

The environment creation failed with the error: Cloud9 could not connect to the EC2 instance. Please check your VPC configuration and network settings to troubleshoot the issue..
```
![scloud9 create error](../../images/2022-11-26-03.png)

``` bash
Cloud9 could not connect to the EC2 instance. Please check your VPC configuration and network settings to troubleshoot the issue. Go to CloudFormation
```
![scloud9 create error](../../images/2022-11-26-02.png)

## サブネットの設定
  - サブネットに紐づくルートテーブルにインターネットゲートウェイは設定済

## 原因
- `パブリック IPv4 アドレスを自動割り当て`が`いいえ`になっていたため

![sub net conf](../../images/2022-11-26-01.png)

- 公式サイトにパブリックIPアドレスの自動割り当てを有効にすると書かれていました。
  - [AWS Cloud9 開発環境の VPC 設定](https://docs.aws.amazon.com/ja_jp/cloud9/latest/user-guide/vpc-settings.html)

>開発環境がSSM を使用して EC2 インスタンスにアクセスし、インスタンスが起動先のパブリックサブネットによってパブリック IP アドレスに割り当てられていることを確認します。これを行うには、独自の IP アドレスを指定するか、パブリック IP アドレスの自動割り当てを有効にします。自動割り当て IP 設定を変更するステップについては、Amazon VPC ユーザーガイドの「VPC の IP アドレス指定」を参照してください。
## 解決方法
- `パブリック IPv4 アドレスを自動割り当て`を`はい`に変更
