export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  genres: { id: number; name: string }[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  runtime: number;
  tagline: string;
}

export interface Cast {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  character: string;
}

export interface Crew {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  job: string;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}