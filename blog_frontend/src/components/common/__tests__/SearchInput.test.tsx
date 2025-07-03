import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SearchInput from '../SearchInput'

describe('SearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should render with default props', () => {
    const mockOnSearch = vi.fn()
    render(<SearchInput onSearch={mockOnSearch} />)

    const input = screen.getByTestId('search-input')
    const searchIcon = screen.getByTestId('search-icon')

    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Search articles...')
    expect(searchIcon).toBeInTheDocument()
  })

  it('should render with custom placeholder', () => {
    const mockOnSearch = vi.fn()
    render(
      <SearchInput 
        onSearch={mockOnSearch} 
        placeholder="Custom placeholder" 
      />
    )

    const input = screen.getByTestId('search-input')
    expect(input).toHaveAttribute('placeholder', 'Custom placeholder')
  })

  it('should call onSearch with debounced value after typing', async () => {
    const mockOnSearch = vi.fn()
    
    render(<SearchInput onSearch={mockOnSearch} debounceDelay={300} />)

    const input = screen.getByTestId('search-input')
    
    // Type in the input
    fireEvent.change(input, { target: { value: 'test query' } })
    
    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    // Fast-forward debounce delay
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query')
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
  })

  it('should show clear button when there is text', () => {
    const mockOnSearch = vi.fn()
    
    render(<SearchInput onSearch={mockOnSearch} />)

    const input = screen.getByTestId('search-input')
    
    // Initially no clear button
    expect(screen.queryByTestId('clear-search')).not.toBeInTheDocument()
    
    // Type something
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Clear button should appear
    expect(screen.getByTestId('clear-search')).toBeInTheDocument()
  })

  it('should clear input when clear button is clicked', () => {
    const mockOnSearch = vi.fn()
    
    render(<SearchInput onSearch={mockOnSearch} />)

    const input = screen.getByTestId('search-input')
    
    // Type something
    fireEvent.change(input, { target: { value: 'test' } })
    expect(input).toHaveValue('test')
    
    // Click clear button
    const clearButton = screen.getByTestId('clear-search')
    fireEvent.click(clearButton)
    
    expect(input).toHaveValue('')
    expect(screen.queryByTestId('clear-search')).not.toBeInTheDocument()
  })

  it('should apply correct styles for different variants', () => {
    const mockOnSearch = vi.fn()
    
    const { rerender } = render(
      <SearchInput onSearch={mockOnSearch} variant="default" />
    )
    
    let input = screen.getByTestId('search-input')
    expect(input).toHaveClass('w-full', 'px-4', 'py-2', 'rounded-lg')
    
    // Test header variant
    rerender(<SearchInput onSearch={mockOnSearch} variant="header" />)
    input = screen.getByTestId('search-input')
    expect(input).toHaveClass('w-64', 'text-sm', 'rounded-lg')
    
    // Test hero variant
    rerender(<SearchInput onSearch={mockOnSearch} variant="hero" />)
    input = screen.getByTestId('search-input')
    expect(input).toHaveClass('w-full', 'px-6', 'py-4', 'text-lg', 'rounded-full')
  })

  it('should debounce rapid typing', () => {
    const mockOnSearch = vi.fn()
    
    render(<SearchInput onSearch={mockOnSearch} debounceDelay={300} />)

    const input = screen.getByTestId('search-input')
    
    // Type characters rapidly
    fireEvent.change(input, { target: { value: 'a' } })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    fireEvent.change(input, { target: { value: 'ab' } })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    fireEvent.change(input, { target: { value: 'abc' } })
    
    // Should not have called onSearch yet
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    // Fast-forward full delay
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    // Should only call once with final value
    expect(mockOnSearch).toHaveBeenCalledWith('abc')
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
  })

  it('should handle empty search query after typing', () => {
    const mockOnSearch = vi.fn()
    
    render(<SearchInput onSearch={mockOnSearch} debounceDelay={300} />)

    const input = screen.getByTestId('search-input')
    
    // Type something first
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(mockOnSearch).toHaveBeenCalledWith('test')
    
    // Then clear
    fireEvent.change(input, { target: { value: '' } })
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(mockOnSearch).toHaveBeenCalledWith('')
    expect(mockOnSearch).toHaveBeenCalledTimes(2)
  })
}) 