import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import PokemonDetails from './pages/PokemonDetails'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f0f0f] text-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
