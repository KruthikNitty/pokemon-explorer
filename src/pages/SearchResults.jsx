import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PokemonCard from '../components/PokemonCard'
import { SkeletonCard } from '../components/Loader'
import { getAllPokemon, getPokemon } from '../services/api'

const BATCH_SIZE = 24

function SearchResults() {
  const { query } = useParams()
  const navigate = useNavigate()

  const [allNames, setAllNames] = useState([])
  const [results, setResults] = useState([])
  const [displayed, setDisplayed] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null)


  const cache = useRef({})

  useEffect(() => {
    async function loadNames() {
      try {
        const data = await getAllPokemon()
        setAllNames(data.results)
      } catch (err) {
        setError('Could not load Pokémon list. Try again later.')
      }
    }
    if (!allNames.length) loadNames()
  }, [])

  useEffect(() => {
    if (!allNames.length) return
    setLoading(true)
    setError(null)
    setResults([])
    setDisplayed([])

    const filtered = allNames.filter((p) =>
      p.name.includes(query.toLowerCase())
    )

    setResults(filtered)
    loadBatch(filtered.slice(0, BATCH_SIZE))
  }, [query, allNames])

  async function loadBatch(batch) {
    setFetching(true)
    const fetched = await Promise.all(
      batch.map(async (p) => {
        if (cache.current[p.name]) return cache.current[p.name]
        try {
          const data = await getPokemon(p.name)
          cache.current[p.name] = data
          return data
        } catch {
          return null
        }
      })
    )
    const valid = fetched.filter(Boolean)
    setDisplayed((prev) => [...prev, ...valid])
    setFetching(false)
    setLoading(false)
  }

  function loadMore() {
    const start = displayed.length
    const next = results.slice(start, start + BATCH_SIZE)
    loadBatch(next)
  }

  function handleSearch(newQuery) {
    navigate(`/search/${newQuery.toLowerCase()}`)
  }

  const hasMore = displayed.length < results.length

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="max-w-md mb-6">
          <SearchBar onSearch={handleSearch} defaultValue={query} />
        </div>
        {!loading && (
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl font-bold">
              {results.length > 0 ? (
                <>
                  <span className="text-red-500">{results.length}</span> results for "
                  <span className="text-white">{query}</span>"
                </>
              ) : (
                'No results found'
              )}
            </h1>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <p className="text-gray-600 text-sm">Check your connection and try again.</p>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && results.length === 0 && (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-display text-2xl font-bold mb-2">No Pokémon found</h2>
          <p className="text-gray-500 mb-6">
            We couldn't find any Pokémon matching "<span className="text-white">{query}</span>".
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      )}

      {/* Results grid */}
      {!loading && displayed.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayed.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
            {fetching &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
          </div>

          {hasMore && !fetching && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm font-semibold transition-all"
              >
                Load more ({results.length - displayed.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default SearchResults
