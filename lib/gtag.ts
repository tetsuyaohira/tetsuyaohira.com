export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''
export const existsGaId = GA_ID !== ''

declare global {
  interface Window {
    gtag: any
  }
}

export const pageview = (path: string) => {
  window.gtag('config', GA_ID, {
    page_path: path,
  })
}

export const event = ({ action, category, label, value = '' }: { action: string; category: string; label: string; value?: string }): void => {
  if (!existsGaId) {
    return
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: JSON.stringify(label),
    value,
  })
}
