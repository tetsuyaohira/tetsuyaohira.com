import Layout from '../../components/Layout'
import { getAllPostIds, getPostData } from '../../lib/post'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { hybrid } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

export async function getStaticPaths() {
  const paths = getAllPostIds()

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)

  return {
    props: {
      postData,
    },
  }
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className="p-10">
        <h1 className="text-3xl font-bold">{postData.title}</h1>
        <div className="mt-5 text-gray-500">{postData.date}</div>
        {/* eslint-disable-next-line react/no-children-prop */}
        <ReactMarkdown
          className="prose mt-5"
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={hybrid}
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
