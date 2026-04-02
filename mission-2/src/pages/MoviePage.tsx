import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  // 1. 로딩 상태
  const [isPending, setIsPending] = useState(false);
  // 2. 에러 상태
  const [isError, setIsError] = useState(false);

  const [page, setPage] = useState(1);

  const { category = 'popular' } = useParams<{ category: string }>();

  useEffect(() => {
      const fetchMovies = async () => {
        setIsPending(true);
        setIsError(false);

        try {
          const { data } = await axios.get<MovieResponse>(
            `https://api.themoviedb.org/3/movie/${category}?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        console.log(data);

        setMovies(data.results);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }

    };

    if (category) {
      fetchMovies();
    }

  }, [page, category]);

  if (isError) {
    return (
      <div className='p-10 flex justify-center items-center h-64'>
        <span className='text-red-500 text-2xl font-bold'>에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <div className='p-10'>
      {isPending ? (
        <div className='flex justify-center items-center h-64'>
          <LoadingSpinner />
        </div>
      ) : (
        <>
        <div className='flex items-center justify-center gap-6'>
            <button
              className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shaow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed'
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className='font-bold text-xl text-gray-700'>{page}</span>
            <button
              className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shaow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed'
              onClick={() => setPage((prev) => prev + 1)}   
            >
              Next
            </button>
          </div>

          <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-10'>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}