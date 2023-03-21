import Head from 'next/head'
import Link from 'next/link'

export const siteTitle = "Tetsuya Ohira's Blog"

function Layout({ children, home }) {
  return (
    <div className="m-auto mt-10 max-w-screen-lg p-5">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex flex-col items-center">
        {home ? (
          <>
            <img className="h-32 w-32 rounded-full" src="/images/profile.jpg" />
            <h1 className="mt-4 text-4xl">{siteTitle}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <img
                className="h-24 w-24 cursor-pointer rounded-full"
                src="/images/profile.jpg"
              />
            </Link>
            <Link href="/">
              <h1 className="mt-4 cursor-pointer text-4xl">{siteTitle}</h1>
            </Link>
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
