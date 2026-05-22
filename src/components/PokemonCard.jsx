import { Link } from 'react-router-dom'
import { TYPE_COLORS, getOfficialArtwork } from '../services/api'

function PokemonCard({ pokemon }) {
  const id = pokemon.id || pokemon.url?.split('/').filter(Boolean).pop()
  const name = pokemon.name
  const types = pokemon.types || []
  const imageUrl = getOfficialArtwork(id)

  const primaryType = types[0]?.type?.name || 'normal'
  const typeColor = TYPE_COLORS[primaryType] || '#A8A878'

  return (
    <Link to={`/pokemon/${name}`} className="block group">
      <div
        className="relative rounded-2xl overflow-hidden bg-[#1a1a2e] border border-white/5 card-hover cursor-pointer"
        style={{ boxShadow: `0 4px 20px ${typeColor}20` }}
      >
        {/* Top gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-70"
          style={{ background: `linear-gradient(90deg, ${typeColor}, transparent)` }}
        />

        {/* Pokemon ID */}
        <div className="absolute top-3 right-3 text-xs text-gray-600 font-display font-semibold">
          #{String(id).padStart(4, '0')}
        </div>

        {/* Image */}
        <div
          className="relative pt-6 pb-2 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 50% 60%, ${typeColor}15, transparent 70%)`,
          }}
        >
          <img
            src={imageUrl}
            alt={name}
            className="w-28 h-28 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            }}
          />
        </div>

        {/* Info */}
        <div className="px-4 pb-4">
          <h3 className="font-display font-semibold text-base capitalize text-white mb-2">
            {name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <span
                key={t.type.name}
                className="type-badge text-[10px]"
                style={{ backgroundColor: TYPE_COLORS[t.type.name] || '#A8A878' }}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PokemonCard
