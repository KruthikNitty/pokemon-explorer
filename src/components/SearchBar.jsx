import { useState } from 'react'

function SearchBar({ onSearch, compact = false, defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative flex items-center ${compact ? 'h-9' : 'h-12'}`}>
        <div className="absolute left-3 text-gray-500">
          <svg className={compact ? 'w-4 h-4' : 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search Pokémon..."
          className={`w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/60 focus:bg-white/8 transition-all ${
            compact ? 'h-9 text-sm' : 'h-12 text-base'
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue('')}
            className="absolute right-3 text-gray-500 hover:text-gray-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar
