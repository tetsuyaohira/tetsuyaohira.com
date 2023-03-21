---
title: "コードブロックのシンタックスハイライト対応しました"
date: "2023-03-19"
---

このブログのコードブロックのシンタックハイライト対応を行いました。

### Before
![before](../../images/2023-03-19-01.png)
### After
![after](../../images/2023-03-19-02.png)

## 手順

### 1. 必要なライブラリをインストール
``` bash
npm install react-markdown
npm install react-syntax-highlighter
```
### 2. コンポーネントで`import`する
``` js
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
```
- `Prism`の方が機能が多いので`Prism`を使用する
``` js
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
```
- 公式サイトの通りに、`import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'`と書くとエラーになるので、`cjs`を使用する
- `vscDarkPlus`は、`Visual Studio Code`の`Dark+`テーマ
- 他のテーマは[こちら](https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_PRISM.MD)

### 3. `ReactMarkdown`タグを追加
``` jsx
export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className="p-10">
        <h1 className="text-3xl font-bold">{postData.title}</h1>
        <div className="mt-5 text-gray-500">{postData.date}</div>
        <ReactMarkdown
          className="prose mt-5"
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
          }}
        >
          {postData.markdown}
        </ReactMarkdown>
      </article>
    </Layout>
  )
}
```
- `ReactMarkdown`タグの中に`{postData.markdown}`を記述する
- 公式サイトの通りに、`children={postData.markdown}`のように`props`として渡すと、`ESLint: Do not pass children as props. Instead, nest children between the opening and closing tags.(react/no-children-prop)`エラーが発生するので、`ReactMarkdown`タグに`{postData.markdown}`を挟む
- `SyntaxHighlighter`についても同様に、`SyntaxHighlighter`要素でコードブロックをを挟む

## 参考
- [react-markdownのデモサイト](https://remarkjs.github.io/react-markdown)
- [react-markdownのGitHubサイト](https://github.com/remarkjs/react-markdown)
- [react-syntax-highlighterのGitHubサイト](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [react-syntax-highlighterで使用できる言語一覧](https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_PRISM.MD)