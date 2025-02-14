export interface TMDBOptions {
  api_key: string;
  language?: string;
  region?: string
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: String
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: Genre[];
  popularity: number;
  runtime: number;
  status: string;
  poster_path: string;
  imdb_id: string;
  backdrop_path: string;
}

export interface DiscoverParams {
  sort_by?: string;
  page?: number;
  with_genres?: string;
  release_year?: number;
}