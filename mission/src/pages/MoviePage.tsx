import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCustomFetch } from '../hooks/useCustomFetch';
import type { MovieResponse } from '../types/movie';

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category = 'popular' } = useParams<{ category: string }>();

  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
  );

  const movies = data?.results || [];

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
          <div className='flex items-center justify-center gap-6 mb-8'>
            <button
              className='bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed'
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              &lt;
            </button>
            <span className='font-bold text-lg text-gray-700'>{page} 페이지</span>
            <button
              className='bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300'
              onClick={() => setPage((prev) => prev + 1)}
            >
              &gt;
            </button>
          </div>

          <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}