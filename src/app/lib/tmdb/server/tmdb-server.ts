import { RegionCode } from '../../regions';
import { getRegionFromCookie } from '../../helpers/region';
import { getDirectorNames } from '../../helpers/directors';
import { transformWatchProviders } from '../../helpers/provider-link';
import { MovieCredits, MovieDetails, TMDBResponse, TMDBWatchProvidersResponse } from '../types';

// Main TMDB API fetcher for server components
export async function fetchTMDBData<T = any>(
  endpoint: string, 
  options: { 
    region?: RegionCode;
    [key: string]: any;
  } = {}
): Promise<T> {
  const { region, ...restOptions } = options;
  
  const regionToUse = region || await getRegionFromCookie();
  
  const queryParams = new URLSearchParams();
  
  // Handle nested objects properly
  Object.entries(restOptions).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        queryParams.append(key, JSON.stringify(value));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });
  
  queryParams.append('region', regionToUse);
  
  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 86400 },
    }
  );
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchMovieBundle(id: string) {
  const region = await getRegionFromCookie();

  const [movie, credits, similar, providers] = await Promise.all([
    fetchTMDBData(`movie/${id}`) as Promise<MovieDetails>,
    fetchTMDBData(`movie/${id}/credits`) as Promise<MovieCredits>,
    fetchTMDBData(`movie/${id}/similar`) as Promise<TMDBResponse>,
    fetchTMDBData(`movie/${id}/watch/providers`) as Promise<TMDBWatchProvidersResponse>,
  ]);

  const topCast = credits?.cast?.slice(0, 6) || [];
  const directors = credits?.crew?.filter((member) => member.job === "Director") || [];

  const regionSpecificProviders = providers.results[region];
  const watchOptions = transformWatchProviders(regionSpecificProviders, movie.title, region);

  return {
    movie,
    topCast,
    directors,
    similar: similar.results,
    watchOptions,
  };
}