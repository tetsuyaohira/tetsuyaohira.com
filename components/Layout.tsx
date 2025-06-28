import Head from 'next/head'
import Link from 'next/link'
import { FC, ReactNode } from 'react'

export const siteTitle = "Tetsuya Ohira's Blog"

type Props = {
  children: ReactNode
  home: boolean
  title: string
  description?: string
  tags?: string[]
}
const Layout: FC<Props> = ({ children, home, title, description, tags }) => {
  return (
    <div className="container m-auto p-5">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        
        {description && <meta name="description" content={description} />}
        {tags && <meta name="keywords" content={tags.join(', ')} />}
        
      </Head>

      <header className="flex flex-col items-center">
        <Link href="/">
          <img
            className="h-32 w-32 cursor-pointer rounded-full"
            src="/images/profile.jpg"
            alt="avatar"
          />
        </Link>
        <Link href="/" className="mt-4 cursor-pointer text-4xl">
          <h1>{siteTitle}</h1>
        </Link>
      </header>

      <section>
        <p className="text-center text-base">Software Developer in Japan 🚀</p>
      </section>

      <main>{children}</main>

      {!home && (
        <div className="mt-16">
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  )
}

export default Layout
