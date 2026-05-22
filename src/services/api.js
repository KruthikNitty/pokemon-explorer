const BASE_URL = 'https://pokeapi.co/api/v2'

export async function getPokemon(nameOrId) {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)
  if (!res.ok) throw new Error('Pokemon not found')
  return res.json()
}

export async function getAllPokemon(limit = 1302) {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=0`)
  if (!res.ok) throw new Error('Failed to fetch pokemon list')
  return res.json()
}

export async function getPokemonSpecies(nameOrId) {
  const res = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`)
  if (!res.ok) return null
  return res.json()
}

export function getOfficialArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export const TYPE_COLORS = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
}
