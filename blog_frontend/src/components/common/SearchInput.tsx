import React from 'react'
import { useDebouncedSearch } from '../../hooks/useDebounce'

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  variant?: 'default' | 'header' | 'hero'
  debounceDelay?: number
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Search articles...",
  className = "",
  variant = 'default',
  debounceDelay = 300,
}) => {
  const { searchQuery, setSearchQuery } = useDebouncedSearch(onSearch, debounceDelay)

  const getVariantStyles = () => {
    switch (variant) {
      case 'header':
        return "w-64 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
      case 'hero':
        return "w-full px-6 py-4 text-lg rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 shadow-lg focus:shadow-xl"
      default:
        return "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
    }
  }

  const handleClear = () => {
    setSearchQuery('')
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={getVariantStyles()}
        data-testid="search-input"
      />
      
      {/* Search Icon */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
        {searchQuery && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            data-testid="clear-search"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <svg 
          className="w-5 h-5 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          data-testid="search-icon"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  )
}

export default SearchInput 