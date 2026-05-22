import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleSearch(query) {
    if (query.trim()) {
      navigate(`/search/${query.trim().toLowerCase()}`)
      setMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-4 h-0.5 bg-white rounded-full" />
            </div>
            <span className="font-display font-800 text-lg tracking-tight">
              Poké<span className="text-red-500">Explorer</span>
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:block flex-1 max-w-sm mx-8">
            <SearchBar onSearch={handleSearch} compact />
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link
              to="/search/a"
              className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
            >
              All Pokémon
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <SearchBar onSearch={handleSearch} compact />
            <div className="flex gap-4 pt-2">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm text-gray-400 hover:text-white">Home</Link>
              <Link to="/search/a" onClick={() => setMenuOpen(false)} className="text-sm text-gray-400 hover:text-white">All Pokémon</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
