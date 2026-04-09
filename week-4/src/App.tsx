import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import MoviePage from './pages/MoviePage';
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MoviePage />} />
        <Route path="/movies/:category" element={<MoviePage />} />
        <Route path="/movie/:movieId" element={<MovieDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;