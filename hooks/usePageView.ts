import { useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'

import { existsGaId, pageview } from '../lib/gtag'

export default function usePageView(): void {
  const router: NextRouter = useRouter()

  useEffect(() => {
    if (!existsGaId) {
      return
    }
    const handleRouteChange = (path: string): void => {
      pageview(path)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return (): void => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
}
