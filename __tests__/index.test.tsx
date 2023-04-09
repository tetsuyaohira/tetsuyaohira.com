import { render, screen } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'
import { all } from 'mdast-util-to-hast'

describe('Home', () => {
  it('renders a heading', () => {
    const allPostsData = []
    render(<Home allPostsData={allPostsData} />)

    const heading = screen.getByRole('heading', {
      name: /Tetsuya Ohira's Blog/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
