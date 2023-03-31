import '../styles/globals.css'
import GoogleAnalytics from '../components/GoogleAnalytics'
import usePageView from '../hooks/usePageView'

function App({ Component, pageProps }) {
  usePageView()

  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  )
}

export default App
