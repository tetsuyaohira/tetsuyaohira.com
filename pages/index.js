import Head from 'next/head'
import Link from 'next/link'
import Layout, {siteTitle} from "../components/Layout"
import {getPostsData} from '../lib/post'
import styled from 'styled-components'

const Articles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  `
const PostedDate = styled.small`
  color: #999;
  `
const StyledA = styled.a`
  color: black;
  font-weight: 550;
`
const StyledP = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  text-align: center;
`

// SSGの場合
export async function getStaticProps() {
    const allPostsData = getPostsData()
    return {
        props: {
            allPostsData
        }
    }
}

export default function Home({allPostsData}) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>

            <section>
                <StyledP>
                    Software Developer in Japan🧑‍💻
                </StyledP>
            </section>

            <section>
                <Articles >
                    {allPostsData.map(({id, title, date}) => (
                        <article key={{id}}>
                            <PostedDate>
                                {`${date}`}
                            </PostedDate>
                            <br/>
                            <Link href={`/posts/${id}`}>
                                <StyledA>{`${title}`}</StyledA>
                            </Link>
                        </article>
                    ))}
                </Articles>
            </section>
        </Layout>
    )
}
