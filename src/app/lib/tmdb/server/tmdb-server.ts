import { RegionCode } from "../../regions";
import { getRegionFromCookie } from "../../helpers/region";
import { transformWatchProviders } from "../../helpers/provider-link";
import {
  MovieCastMember,
  MovieCrewMember,
  MovieDetails,
  TMDBWatchProvidersResponse,
  TvShowCastMember,
  TvShowCrewMember,
  TVShowDetails,
} from "../types";
import {
  extractMovieDirectors,
  extractTvDirectors
} from "../../helpers/directors";

type BundleType = "movie" | "tv";

interface BundleResult<T, C, D> {
  item: T;
  topCast: C[];
  directors: D[] | null
  similar: T[];
  watchOptions: ReturnType<typeof transformWatchProviders>;
}

// Main TMDB API fetcher for server components
export async function fetchTMDBData<T = any>(
  endpoint: string,
  options: {
    region?: RegionCode;
    [key: string]: any;
  } = {}
): Promise<T> {
  const { region, ...restOptions } = options;

  const regionToUse = region || (await getRegionFromCookie());

  const queryParams = new URLSearchParams();

  // Handle nested objects properly
  Object.entries(restOptions).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(","));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  queryParams.append("watch_region", regionToUse);

  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 },
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchBundle<T, C, D>(
  id: string,
  type: BundleType,
  getDirectors: (crew: any[]) => D[] | null
): Promise<BundleResult<T, C, D>> {
  const region = await getRegionFromCookie();

  const creditsEndpoint = type === "movie" ? 'credits' : 'aggregate_credits'

  const [item, credits, similar, providers] = await Promise.all([
    fetchTMDBData<T>(`${type}/${id}`),
    fetchTMDBData<{ cast: C[]; crew: D[] }>(`${type}/${id}/${creditsEndpoint}`),
    fetchTMDBData<{ results: T[] }>(`${type}/${id}/similar`),
    fetchTMDBData<TMDBWatchProvidersResponse>(`${type}/${id}/watch/providers`),
  ])

  const topCast = credits?.cast?.slice(0, 6) || [];
  const directors = getDirectors(credits.crew);

  const regionSpecificProviders = providers.results[region];
  const title = type === "movie" ? (item as any).title : (item as any).name;

  const watchOptions = transformWatchProviders(regionSpecificProviders, title, region);

  return {
    item,
    topCast,
    directors,
    similar: similar.results,
    watchOptions,
  };
}

export async function fetchMovieBundle(id: string) {
  const { item, ...rest} = await fetchBundle<MovieDetails, MovieCastMember, MovieCrewMember>(
    id,
    "movie",
    extractMovieDirectors
  );

  return {
    movie: item,
    ...rest,
  };
}

export async function fetchTvShowBundle(id: string) {
  const { item, ...rest } = await fetchBundle<TVShowDetails, TvShowCastMember, TvShowCrewMember>(
    id,
    "tv",
    extractTvDirectors
  );

  return {
    tvShow: item,
    ...rest,
  };
}
