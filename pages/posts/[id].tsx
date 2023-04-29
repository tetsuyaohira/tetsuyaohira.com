import Layout from '../../components/Layout'
import { getAllPostIds, getPostData } from '../../lib/post'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { NextPage } from 'next'
import { PostData } from '../../types/types'

export async function getStaticPaths() {
  const paths = getAllPostIds()

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const postData: PostData = await getPostData(params.id)

  return {
    props: {
      postData,
    },
  }
}

type Props = {
  postData: PostData
}

const Post: NextPage<Props> = ({ postData }) => {
  return (
    <Layout home={false} title={postData.title}>
      <article className="pt-10">
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
export default Post
