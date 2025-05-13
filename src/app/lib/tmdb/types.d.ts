export interface TMDBOptions {
  api_key: string;
  language?: string;
  region?: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: String;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  popularity: number;
  adult: boolean;
  genre_ids: Genre[];
  runtime: number;
  status: string;
  imdb_id: string;
}

export interface TVDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  popularity: number;
  genre_ids: Genre[];
  original_language: string;
  original_name: string;
  adult: boolean;
}

export interface DiscoverParams {
  sort_by?: string;
  page?: number;
  with_genres?: string;
  release_year?: number;
}

export interface MediaItem {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
}
