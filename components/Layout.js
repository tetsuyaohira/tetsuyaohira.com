import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

const name = 'Tetsuya Ohira / 大平 哲也'
export const siteTitle = "Tetsuya Ohira's Blog"

function Layout({children, home}) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <header className={styles.header}>
                {home ? (
                    <>
                        <img className={`${utilStyles.borderCircle} ${styles.headerHomeImage}`}
                             src="/images/profile.jpg"/>
                        <h1 className={utilStyles.heading2Xl}>{siteTitle}</h1>
                    </>
                ) : (
                    <>
                        <img className={`${utilStyles.borderCircle}  ${styles.headerImage}`} src="/images/profile.jpg"/>
                        <h1 className={utilStyles.heading2Xl}>{siteTitle}</h1>
                    </>
                )}
            </header>
            <main>{children}</main>

            {!home && (
                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            )}


        </div>
    )
}

export default Layout
