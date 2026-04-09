import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';

export default function MovieCard({ movie }: { movie: Movie }) {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer'>
        <img src={imageUrl} alt={movie.title} className="w-full h-[300px] object-cover"/>
        <div className='p-2'>
          <h3 className='text-sm font-bold'>{movie.title}</h3>
        </div>
      </div>
    </Link>
  );
}