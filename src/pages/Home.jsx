import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import { getPokemon, getAllPokemon, getOfficialArtwork, TYPE_COLORS } from '../services/api'

function getDailyPokemonId() {
  const today = new Date().toISOString().split('T')[0]
  const stored = localStorage.getItem('daily_pokemon')

  if (stored) {
    const { date, id } = JSON.parse(stored)
    if (date === today) return id
  }

  
  const newId = Math.floor(Math.random() * 898) + 1
  localStorage.setItem('daily_pokemon', JSON.stringify({ date: today, id: newId }))
  return newId
}

function Home() {
  const navigate = useNavigate()
  const [dailyPokemon, setDailyPokemon] = useState(null)
  const [dailyLoading, setDailyLoading] = useState(true)
  const [popularPokemon, setPopularPokemon] = useState([])
  const [popularLoading, setPopularLoading] = useState(true)

  useEffect(() => {
    const id = getDailyPokemonId()
    getPokemon(id)
      .then(setDailyPokemon)
      .catch(console.error)
      .finally(() => setDailyLoading(false))
  }, [])

  useEffect(() => {
   
    const popularIds = [6, 25, 39, 52, 94, 130, 143, 149, 248, 384]
    Promise.all(popularIds.map((id) => getPokemon(id)))
      .then(setPopularPokemon)
      .catch(console.error)
      .finally(() => setPopularLoading(false))
  }, [])

  function handleSearch(query) {
    navigate(`/search/${query.toLowerCase()}`)
  }

  const primaryType = dailyPokemon?.types?.[0]?.type?.name
  const typeColor = TYPE_COLORS[primaryType] || '#E3350D'

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-[#0f0f0f] to-[#0f0f0f]" />
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-900/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-red-900/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-400 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              1,302 Pokémon available
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-4">
              Explore the<br />
              <span className="text-red-500">Pokémon</span> world
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Search, discover, and dive deep into stats, abilities, and everything about your favourite Pokémon.
            </p>
            <SearchBar onSearch={handleSearch} />
            <p className="text-xs text-gray-600 mt-3">
              Try searching "charizard", "bulbasaur", or "mewtwo"
            </p>
          </div>
        </div>
      </section>

      {/* Daily Pokemon */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold">Pokémon of the Day</h2>
            <p className="text-gray-500 text-sm mt-0.5">Changes every day at midnight</p>
          </div>
          <span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {dailyLoading ? (
          <div className="rounded-3xl bg-[#1a1a2e] border border-white/5 h-64 flex items-center justify-center">
            <Loader text="Finding today's Pokémon..." />
          </div>
        ) : dailyPokemon ? (
          <DailyCard pokemon={dailyPokemon} typeColor={typeColor} />
        ) : null}
      </section>

      {/* Popular Pokemon */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="font-display text-2xl font-bold mb-6">Fan Favourites</h2>
        {popularLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#1a1a2e] border border-white/5 h-44 shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularPokemon.map((p) => (
              <MiniCard key={p.id} pokemon={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function DailyCard({ pokemon, typeColor }) {
  const artworkUrl = getOfficialArtwork(pokemon.id)

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-white/8 p-6 md:p-8"
      style={{
        background: `linear-gradient(135deg, ${typeColor}25, ${typeColor}08, #1a1a2e)`,
        boxShadow: `0 0 60px ${typeColor}20`,
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, ${typeColor} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Image */}
        <div className="relative flex-shrink-0">
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-30"
            style={{ background: typeColor }}
          />
          <img
            src={artworkUrl}
            alt={pokemon.name}
            className="relative w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-2xl animate-float"
            onError={(e) => {
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs text-gray-500 font-display font-semibold tracking-widest uppercase mb-1">
            #{String(pokemon.id).padStart(4, '0')}
          </p>
          <h3 className="font-display text-4xl md:text-5xl font-bold capitalize mb-3 text-white">
            {pokemon.name}
          </h3>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="type-badge"
                style={{ backgroundColor: TYPE_COLORS[t.type.name] }}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <Stat label="Height" value={`${(pokemon.height / 10).toFixed(1)}m`} />
            <Stat label="Weight" value={`${(pokemon.weight / 10).toFixed(1)}kg`} />
            <Stat label="Base XP" value={pokemon.base_experience || '—'} />
          </div>

          <Link
            to={`/pokemon/${pokemon.name}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${typeColor}, ${typeColor}cc)` }}
          >
            View Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-black/20 rounded-xl p-2.5 text-center">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="font-display font-semibold text-white">{value}</p>
    </div>
  )
}

function MiniCard({ pokemon }) {
  const primaryType = pokemon.types?.[0]?.type?.name
  const typeColor = TYPE_COLORS[primaryType] || '#A8A878'

  return (
    <Link to={`/pokemon/${pokemon.name}`} className="block group">
      <div
        className="rounded-2xl bg-[#1a1a2e] border border-white/5 card-hover p-3"
        style={{ boxShadow: `0 4px 20px ${typeColor}15` }}
      >
        <div
          className="rounded-xl flex items-center justify-center py-3 mb-2"
          style={{ background: `radial-gradient(circle, ${typeColor}20, transparent 70%)` }}
        >
          <img
            src={getOfficialArtwork(pokemon.id)}
            alt={pokemon.name}
            className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
            }}
          />
        </div>
        <p className="text-xs text-gray-600 font-display text-center">
          #{String(pokemon.id).padStart(3, '0')}
        </p>
        <p className="font-display font-semibold text-sm capitalize text-center text-white">
          {pokemon.name}
        </p>
      </div>
    </Link>
  )
}

export default Home
