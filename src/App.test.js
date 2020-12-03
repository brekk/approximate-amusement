import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the app', () => {
  render(<App autofetch={false} />)
  const linkElement = screen.getByText(/Approximate Amusement/i)
  expect(linkElement).toBeInTheDocument()
})
