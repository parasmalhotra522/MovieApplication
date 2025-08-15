import { TMDB_API_KEY } from '@env';

const BASE = 'https://api.themoviedb.org/3';

export type Movie = {
  id: number;
  title: string;
  name?: string;
  overview: string;
  release_date?: string;
  genre_ids?: number[];
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type Genre = { id: number; name: string };

export type Credits = {
  cast: Array<{ id: number; name: string; profile_path: string | null; character?: string }>;
  crew: Array<{ id: number; name: string; job: string }>;
};

export type MovieDetails = Movie & {
  genres: Genre[];
  runtime?: number;
  credits?: Credits;
  videos?: { results: Array<{ key: string; site: string; type: string; official: boolean }> };
};

const withKey = (path: string) =>
  `${BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=en-US`;

export const img = {
  poster: (p: string | null, size: 'w342'|'w500'|'w780'|'original' = 'w500') => p ? `https://image.tmdb.org/t/p/${size}${p}` : null,
  backdrop: (p: string | null, size: 'w780'|'w1280'|'original' = 'w1280') => p ? `https://image.tmdb.org/t/p/${size}${p}` : null,
  profile: (p: string | null, size: 'w185'|'w342'|'original' = 'w185') => p ? `https://image.tmdb.org/t/p/${size}${p}` : null,
};

async function get<T>(url: string): Promise<T> {
  if (!TMDB_API_KEY) throw new Error('TMDB_API_KEY missing (.env not loaded)');
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function getNowPlaying(): Promise<Movie[]> {
  const data = await get<{ results: Movie[] }>(withKey('/movie/now_playing'));
  return data.results;
}

export async function getUpcoming(): Promise<Movie[]> {
  const data = await get<{ results: Movie[] }>(withKey('/movie/upcoming'));
  return data.results;
}

export async function getPopular(): Promise<Movie[]> {
  const data = await get<{ results: Movie[] }>(withKey('/movie/popular'));
  return data.results;
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const path = `/movie/${id}?append_to_response=credits,videos`;
  return await get<MovieDetails>(withKey(path));
}
