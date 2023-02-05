import Layout from '../../components/Layout'
import {getAllPostIds, getPostData} from '../../lib/post'
import Head from 'next/head'
import styled from 'styled-components'

export async function getStaticPaths() {
    const paths = getAllPostIds()

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params}) {
    const postData = await getPostData(params.id)

    return {
        props: {
            postData
        }
    }
}

const StyledH1 = styled.h1`
  font-size: 2rem;
  line-height: 1.3;
  font-weight: 800;
  letter-spacing: -0.05rem;
  margin: 1rem 0;
`
const StyledDiv = styled.div`
  color: #999;

`


export default function Post({postData}) {

    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <StyledH1>{postData.title}</StyledH1>
                <StyledDiv>  {postData.date}</StyledDiv>
                <div dangerouslySetInnerHTML={{__html: postData.blogContentHTML}}/>
            </article>
        </Layout>
    )
}