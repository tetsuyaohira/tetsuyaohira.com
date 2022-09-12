import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Layout, {siteTitle} from "../components/Layout"
import utilStyles from '../styles/utils.module.css'
import {getPostsData} from '../lib/post'

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
                <p className={utilStyles.headingMd}>
                    Software Developer in Japan🧑‍💻
                </p>
            </section>

            <section>
                <div className={styles.articles}>
                    {allPostsData.map(({id, title, date}) => (
                        <article key={{id}}>
                            <small className={utilStyles.lightText}>
                                {`${date}`}
                            </small>
                            <br/>
                            <Link href={`/posts/${id}`}>
                                <a className={utilStyles.boldText}>{`${title}`}</a>
                            </Link>
                        </article>
                    ))}
                </div>
            </section>
        </Layout>
    )
}
