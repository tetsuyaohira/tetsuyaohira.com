import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MarkdownLink from '../components/MarkdownLink'

describe('MarkdownLink', () => {
  it('opens external links in a new tab', () => {
    render(
      <>
        <MarkdownLink href="https://www.amazon.co.jp/dp/B07TS5MBRB">
          Charging cradle
        </MarkdownLink>
        <MarkdownLink href="https://example.com">Example</MarkdownLink>
      </>,
    )

    for (const name of ['Charging cradle', 'Example']) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('target', '_blank')
      expect(screen.getByRole('link', { name })).toHaveAttribute(
        'rel',
        'noopener noreferrer',
      )
    }
  })

  it('keeps links on the site in the same tab', () => {
    render(
      <>
        <MarkdownLink href="/posts/example">Relative link</MarkdownLink>
        <MarkdownLink href="https://tetsuyaohira.com/posts/example">
          Absolute link
        </MarkdownLink>
        <MarkdownLink href="https://www.tetsuyaohira.com/posts/example">
          Subdomain link
        </MarkdownLink>
      </>,
    )

    for (const name of ['Relative link', 'Absolute link', 'Subdomain link']) {
      expect(screen.getByRole('link', { name })).not.toHaveAttribute('target')
      expect(screen.getByRole('link', { name })).not.toHaveAttribute('rel')
    }
  })

  it('does not treat non-http links as external links', () => {
    render(<MarkdownLink href="mailto:hello@example.com">Email</MarkdownLink>)

    expect(screen.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target')
  })
})
