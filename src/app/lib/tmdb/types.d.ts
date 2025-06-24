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

interface BaseMediaDetails {
  id: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  popularity: number;
  genres: Genre[];
  original_language: string;
  adult: boolean;
}

export interface MovieDetails extends BaseMediaDetails {
  title: string;
  release_date: string;
  vote_count: number;
  runtime: number;
  status: string;
  imdb_id: string;
  tagline: string;
}

export interface TVShowDetails extends BaseMediaDetails {
  id: number;
  name: string;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
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

interface BasePerson {
  id: number;
  name: string;
  profile_path: string;
}

export interface MovieCastMember extends BasePerson {
  character: string;
  credit_id: string;
}

export interface MovieCrewMember extends BasePerson {
  job: string;
  credit_id: string;
}

export interface MovieCredits {
  id: number;
  cast: MovieCastMember[];
  crew: MovieCrewMember[];
}

export interface TvShowCastRole {
  credit_id: string;
  character: string;
  episode_count: number;
}

export interface TvShowCrewJob {
  credit_id: string;
  job: string;
  episode_count: number;
}

export interface TvShowCastMember extends BasePerson {
  roles: TvShowCastRole[];
  total_episode_count: number;
}

export interface TvShowCrewMember extends BasePerson {
  jobs: TvShowCrewJob[];
  total_episode_count: number;
}

export interface TvShowCredits {
  id: number;
  cast: TvShowCastMember[];
  crew: TvShowCrewMember[];
}

export interface MovieReleaseDates {
  id: number;
  results: {
    iso_3166_1: string;
    release_dates: {
      certification: string;
    }[];
  }[];
}

export interface ReleaseDate {
  certification: string;
  descriptors?: string[];
  iso_639_1?: string;
  note?: string;
  release_date?: string;
  type?: number;
}

export interface RegionCertifications {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

export interface TMDBResponse {
  results: MovieDetails[];
}

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
}
