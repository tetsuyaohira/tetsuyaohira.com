import { ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<'a'> & {
  node?: unknown
}

const SITE_HOSTNAME = 'tetsuyaohira.com'

const isExternalLink = (href?: string) => {
  if (!href) {
    return false
  }

  try {
    const url = new URL(href, `https://${SITE_HOSTNAME}`)
    const isHttpLink = url.protocol === 'http:' || url.protocol === 'https:'
    const isOwnDomain =
      url.hostname === SITE_HOSTNAME || url.hostname.endsWith(`.${SITE_HOSTNAME}`)

    return isHttpLink && !isOwnDomain
  } catch {
    return false
  }
}

const MarkdownLink = ({ node, href, children, ...props }: Props) => {
  const openInNewTab = isExternalLink(href)

  return (
    <a
      {...props}
      href={href}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

export default MarkdownLink
