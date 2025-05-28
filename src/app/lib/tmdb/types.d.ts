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
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: Genre[];
  runtime: number;
  status: string;
  imdb_id: string;
  tagline: string;
  genres: Genre[];
  original_language: string;
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

export interface CastMember {
  id: number;
  character: string;
  credit_id: string;
  name: string;
  profile_path: string
}

export interface CrewMember {
  id: number;
  credit_id: string;
  job: string;
  name: string;
  profile_path: string;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieReleaseDates {
  id: number;
  results: {
    iso_3166_1: string
    release_dates: {
      certification: string;
    }[]
  }[]
}

export interface ReleaseDate {
  certification: string;
  descriptors?: string[];
  iso_639_1?: string;
  note?: string;
  release_date?: string;
  type?: number;
};

export interface RegionCertifications {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
};

export interface TMDBResponse {
  results: MovieDetails[]
};

type TMDBProvider = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};

type TMDBWatchProviderEntry = {
  link?: string;
  rent?: TMDBProvider[];
  buy?: TMDBProvider[];
  flatrate?: TMDBProvider[];
};

export interface TMDBWatchProvidersResponse {
  id: string;
  results: {
    [countryCode: string]: TMDBWatchProviderEntry;
  };
};