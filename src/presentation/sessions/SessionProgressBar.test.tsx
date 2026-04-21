import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SessionProgressBar } from './SessionProgressBar'

describe('SessionProgressBar', () => {
  it('shows 0/N label', () => {
    render(<SessionProgressBar done={0} total={6} />)
    expect(screen.getByText('0 / 6')).toBeInTheDocument()
  })

  it('shows M/N label', () => {
    render(<SessionProgressBar done={3} total={6} />)
    expect(screen.getByText('3 / 6')).toBeInTheDocument()
  })

  it('shows N/N label', () => {
    render(<SessionProgressBar done={6} total={6} />)
    expect(screen.getByText('6 / 6')).toBeInTheDocument()
  })

  it('renders full bar at N/N', () => {
    const { container } = render(<SessionProgressBar done={5} total={5} />)
    const bar = container.querySelector('[style]') as HTMLElement
    expect(bar.style.width).toBe('100%')
  })

  it('renders empty bar at 0/N', () => {
    const { container } = render(<SessionProgressBar done={0} total={5} />)
    const bar = container.querySelector('[style]') as HTMLElement
    expect(bar.style.width).toBe('0%')
  })
})
