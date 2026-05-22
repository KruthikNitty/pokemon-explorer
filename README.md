# PokéExplorer

A Pokemon explorer app I built using React and the free PokeAPI. You can search for any Pokemon, view their stats and abilities, and there's a daily Pokemon that changes every day.

## Features

- **Homepage** — Hero section with search + Daily Pokemon card (changes per day, persists across refreshes via localStorage)
- **Search Results** — Filtered grid with lazy batch loading, skeleton loaders, and empty states
- **Pokemon Details** — Artwork, stats with animated bars, abilities, level-up moves, flavour text
- **Favourites** — Save Pokemon to localStorage with a single click
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

<img width="1842" height="778" alt="Screenshot 2026-05-22 145855" src="https://github.com/user-attachments/assets/f594d084-32c1-4a61-985c-57f7815e6c9e" />
<img width="1839" height="807" alt="Screenshot 2026-05-22 145819" src="https://github.com/user-attachments/assets/86695154-d155-435e-ae33-0c5d485f98bf" />

## API

All data sourced from [PokéAPI](https://pokeapi.co/) — a free, open RESTful Pokémon data API. No API key required.
