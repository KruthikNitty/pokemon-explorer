# PokéExplorer

A modern Pokémon discovery app built with React and the PokéAPI. Search, explore stats, and find your daily Pokémon — all in a clean, responsive interface.

## Features

- **Homepage** — Hero section with search + Daily Pokémon card (changes per day, persists across refreshes via localStorage)
- **Search Results** — Filtered grid with lazy batch loading, skeleton loaders, and empty states
- **Pokémon Details** — Artwork, stats with animated bars, abilities, level-up moves, flavour text
- **Favourites** — Save Pokémon to localStorage with a single click
- **Responsive** — Works across mobile, tablet, and desktop

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router DOM v6
- PokeAPI (https://pokeapi.co/)
- localStorage for daily pokemon & favourites

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Sticky nav with mobile menu + search
│   ├── SearchBar.jsx    # Reusable search input
│   ├── PokemonCard.jsx  # Card used in search results
│   └── Loader.jsx       # Spinner + skeleton card
├── pages/
│   ├── Home.jsx         # Hero, daily pokemon, fan favourites
│   ├── SearchResults.jsx
│   └── PokemonDetails.jsx
├── services/
│   └── api.js           # All PokeAPI fetch functions + type colors
├── App.jsx
└── main.jsx
```

## Screenshots

_Add screenshots here after running the app_

## API

All data sourced from [PokéAPI](https://pokeapi.co/) — a free, open RESTful Pokémon data API. No API key required.
