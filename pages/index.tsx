import Link from 'next/link'
import Layout from '../components/Layout'
import { getPostsData } from '../lib/post'
import { Post } from '../types/types'
import { NextPage } from 'next'

// SSGの場合
export async function getStaticProps(): Promise<{
  props: { allPostsData: Post[] }
}> {
  const allPostsData: Post[] = getPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}

type Props = {
  allPostsData: Post[]
}

const Home: NextPage<Props> = ({ allPostsData }) => {
  return (
    <Layout home={true} title={'tetsuyaohira.com'}>
      <section>
        <article className="flex flex-col gap-y-8 pt-10">
          {allPostsData.map(({ id, title, date }) => (
            <article key={id}>
              <small className="text-gray-500">{`${date}`}</small>
              <br />
              <Link href={`/posts/${id}`}>
                <a className="text font-medium text-black no-underline">{`${title}`}</a>
              </Link>
            </article>
          ))}
        </article>
      </section>
    </Layout>
  )
}
export default Home
