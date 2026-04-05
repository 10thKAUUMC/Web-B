import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { MovieDetails, CreditsResponse } from '../types/movie';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      window.scrollTo(0, 0);
      
      if (!movieId) return;

      setIsPending(true);
      setIsError(false);

      try {
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieDetails>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get<CreditsResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);

        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isError) {
    return (
      <div className='p-10 flex justify-center items-center h-screen bg-black text-white'>
        <span className='text-red-500 text-2xl font-bold'>
          영화 정보를 불러오는 중 에러가 발생했습니다.
        </span>
      </div>
    );
  }

  if (isPending || !movie || !credits) {
    return (
      <div className='p-10 flex justify-center items-center h-screen bg-black'>
        <LoadingSpinner />
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';

  const releaseYear = movie.release_date.split('-')[0];

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='relative w-full h-[600px]'>
        <img
          src={backdropUrl}
          alt={movie.title}
          className='absolute inset-0 w-full h-full object-cover'
        />

        <div className='absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/50' />

        <div className='relative z-10 max-w-7xl mx-auto px-16 pt-[120px] h-full'>
          <div className='max-w-3xl'>
            <h1 className='text-6xl font-extrabold mb-6 tracking-tight'>{movie.title}</h1>
            <div className='flex gap-6 text-gray-100 text-xl mb-6 font-medium'>
              <span>평균 ★ {movie.vote_average.toFixed(1)}</span>
              <span>{releaseYear}년</span>
              <span>{movie.runtime}분</span>
            </div>
            {movie.tagline && (
              <p className='text-3xl italic font-semibold mb-8 text-gray-100'>
                {movie.tagline}
              </p>
            )}
            <p className='text-gray-100 leading-relaxed text-xl line-clamp-5'>
              {movie.overview}
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-16 py-16'>
        <h2 className='text-4xl font-bold mb-12 tracking-tight'>감독/출연</h2>
        <div className='flex gap-10 overflow-x-auto pb-6 scrollbar-hide'>
          {credits.crew
            .filter((c) => c.job === 'Director')
            .map((director) => (
              <div
                key={director.id}
                className='flex flex-col items-center min-w-[130px]'
              >
                <div className='w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-700 bg-gray-800 flex items-center justify-center shadow-lg'>
                  {director.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${director.profile_path}`}
                      alt={director.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='text-gray-500 text-sm'>No Image</span>
                  )}
                </div>
                <span className='font-bold text-center text-lg'>
                  {director.name}
                </span>
                <span className='text-gray-400 text-base text-center mt-1'>
                  Director
                </span>
              </div>
            ))}

          {credits.cast.slice(0, 20).map((actor) => (
            <div
              key={actor.id}
              className='flex flex-col items-center min-w-[130px]'
            >
              <div className='w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-700 bg-gray-800 flex items-center justify-center shadow-lg'>
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-gray-500 text-sm'>No Image</span>
                )}
              </div>
              <span className='font-bold text-center text-lg line-clamp-1'>
                {actor.name}
              </span>
              <span className='text-gray-400 text-base text-center mt-1 line-clamp-2'>
                {actor.character}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;