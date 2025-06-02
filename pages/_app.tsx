import '../styles/globals.css'
import GoogleAnalytics from '../components/GoogleAnalytics'
import usePageView from '../hooks/usePageView'
import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  usePageView()

  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  )
}

export default App
