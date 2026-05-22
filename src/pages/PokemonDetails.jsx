import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { getPokemon, getPokemonSpecies, getOfficialArtwork, TYPE_COLORS } from '../services/api'

const STAT_COLORS = {
  'hp': '#FF5959',
  'attack': '#F5AC78',
  'defense': '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  'speed': '#FA92B2',
}

const STAT_MAX = {
  'hp': 255,
  'attack': 190,
  'defense': 230,
  'special-attack': 194,
  'special-defense': 230,
  'speed': 200,
}

function PokemonDetails() {
  const { name } = useParams()
  const navigate = useNavigate()

  const [pokemon, setPokemon] = useState(null)
  const [species, setSpecies] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('stats')
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setPokemon(null)

    getPokemon(name)
      .then(async (data) => {
        setPokemon(data)
        setLoading(false)
        const favs = JSON.parse(localStorage.getItem('fav_pokemon') || '[]')
        setIsFav(favs.includes(data.id))
        const speciesData = await getPokemonSpecies(data.id).catch(() => null)
        setSpecies(speciesData)
      })
      .catch(() => {
        setError('This Pokémon could not be found.')
        setLoading(false)
      })
  }, [name])

  function toggleFav() {
    const favs = JSON.parse(localStorage.getItem('fav_pokemon') || '[]')
    let newFavs
    if (isFav) {
      newFavs = favs.filter((id) => id !== pokemon.id)
    } else {
      newFavs = [...favs, pokemon.id]
    }
    localStorage.setItem('fav_pokemon', JSON.stringify(newFavs))
    setIsFav(!isFav)
  }

  if (loading) return <Loader text={`Loading ${name}...`} />

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="font-display text-2xl font-bold mb-2">{error}</h2>
        <p className="text-gray-500 mb-6">Double-check the name and try again.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-colors"
        >
          Go back
        </button>
      </div>
    )
  }

  const primaryType = pokemon.types[0]?.type?.name
  const typeColor = TYPE_COLORS[primaryType] || '#E3350D'
  const artworkUrl = getOfficialArtwork(pokemon.id)

  const flavorText = species?.flavor_text_entries
    ?.find((e) => e.language.name === 'en')
    ?.flavor_text?.replace(/\f/g, ' ')

  const genus = species?.genera?.find((g) => g.language.name === 'en')?.genus

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Hero card */}
      <div
        className="relative rounded-3xl overflow-hidden border border-white/8 mb-6 p-6 md:p-8"
        style={{
          background: `linear-gradient(135deg, ${typeColor}20, ${typeColor}06, #1a1a2e)`,
          boxShadow: `0 0 80px ${typeColor}15`,
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
          {/* Image */}
          <div className="relative flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20"
              style={{ background: typeColor }}
            />
            <img
              src={artworkUrl}
              alt={pokemon.name}
              className="relative w-44 h-44 md:w-56 md:h-56 object-contain drop-shadow-2xl animate-float"
              onError={(e) => {
                e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
              }}
            />
          </div>

          {/* Header info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
              <span className="text-sm text-gray-500 font-display font-semibold tracking-wider">
                #{String(pokemon.id).padStart(4, '0')}
              </span>
              {genus && (
                <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  {genus}
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold capitalize text-white mb-3">
              {pokemon.name}
            </h1>

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

            {flavorText && (
              <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-lg">{flavorText}</p>
            )}

            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto md:mx-0 mb-4">
              <InfoBlock label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
              <InfoBlock label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
              <InfoBlock label="Base XP" value={pokemon.base_experience || '—'} />
            </div>

            <button
              onClick={toggleFav}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                isFav
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {isFav ? '♥' : '♡'} {isFav ? 'Saved' : 'Save to Favourites'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/3 rounded-xl p-1 border border-white/5 mb-6 max-w-sm">
        {['stats', 'abilities', 'moves'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${
              activeTab === tab
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && <StatsPanel pokemon={pokemon} typeColor={typeColor} />}
      {activeTab === 'abilities' && <AbilitiesPanel pokemon={pokemon} />}
      {activeTab === 'moves' && <MovesPanel pokemon={pokemon} />}
    </main>
  )
}

function InfoBlock({ label, value }) {
  return (
    <div className="bg-black/20 rounded-xl p-2.5 text-center">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="font-display font-semibold text-white text-sm">{value}</p>
    </div>
  )
}

function StatsPanel({ pokemon, typeColor }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
      <h2 className="font-display font-bold text-lg mb-5">Base Stats</h2>
      <div className="space-y-4">
        {pokemon.stats.map((s) => {
          const statName = s.stat.name
          const value = s.base_stat
          const max = STAT_MAX[statName] || 255
          const pct = Math.round((value / max) * 100)
          const barColor = STAT_COLORS[statName] || typeColor

          return (
            <div key={statName} className="flex items-center gap-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider w-24 text-right shrink-0">
                {statName.replace('special-', 'sp. ')}
              </span>
              <span className="text-sm font-display font-semibold text-white w-8 shrink-0">
                {value}
              </span>
              <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full stat-bar-fill"
                  style={{
                    width: animated ? `${pct}%` : '0%',
                    backgroundColor: barColor,
                    boxShadow: `0 0 8px ${barColor}80`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-white/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total</span>
          <span className="font-display font-bold text-white text-lg">
            {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
          </span>
        </div>
      </div>
    </div>
  )
}

function AbilitiesPanel({ pokemon }) {
  return (
    <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
      <h2 className="font-display font-bold text-lg mb-5">Abilities</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {pokemon.abilities.map((a) => (
          <div
            key={a.ability.name}
            className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-semibold capitalize text-white">
                {a.ability.name.replace('-', ' ')}
              </span>
              {a.is_hidden && (
                <span className="text-[10px] text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                  Hidden
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {a.is_hidden ? 'Hidden ability' : `Ability slot ${a.slot}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MovesPanel({ pokemon }) {
  // Show first 20 moves learned at level-up
  const levelMoves = pokemon.moves
    .filter((m) => m.version_group_details.some((d) => d.move_learn_method.name === 'level-up'))
    .slice(0, 20)

  return (
    <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
      <h2 className="font-display font-bold text-lg mb-1">Level-up Moves</h2>
      <p className="text-xs text-gray-500 mb-5">Showing first 20 moves</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {levelMoves.map((m) => (
          <div
            key={m.move.name}
            className="bg-white/3 border border-white/8 rounded-lg px-3 py-2 hover:border-white/15 transition-colors"
          >
            <span className="text-sm capitalize text-gray-300">
              {m.move.name.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PokemonDetails
