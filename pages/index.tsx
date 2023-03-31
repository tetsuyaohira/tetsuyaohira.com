import Link from 'next/link'
import Layout from '../components/Layout'
import { getPostsData } from '../lib/post'

// SSGの場合
export async function getStaticProps() {
  const allPostsData = getPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}

export default function Home({ allPostsData }) {
  return (
    <Layout home={true}>
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
