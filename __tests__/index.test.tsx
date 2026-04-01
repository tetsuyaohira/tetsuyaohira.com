import { render, screen } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'

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
