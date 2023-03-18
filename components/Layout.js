import Head from 'next/head'
import Link from 'next/link'

const name = 'Tetsuya Ohira / 大平 哲也'
export const siteTitle = "Tetsuya Ohira's Blog"

function Layout({children, home}) {
    return (
        <div className="max-w-screen-lg m-auto mt-10 p-10">
            <Head>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <header className="flex flex-col items-center">
                {home ? (
                    <>
                        <img className="rounded-full w-32 h-32"
                             src="/images/profile.jpg"/>
                        <h1 className="text-4xl mt-4">{siteTitle}</h1>
                    </>
                ) : (
                    <>
                        <img className="rounded-full w-24 h-24"
                             src="/images/profile.jpg"/>
                        <h1 className="text-4xl mt-4">{siteTitle}</h1>
                    </>
                )}
            </header>

            <main>{children}</main>

            {!home && (
                <div className="mt-16">
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Layout
