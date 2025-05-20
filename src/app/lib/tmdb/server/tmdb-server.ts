import { RegionCode } from '../../regions';
import { getRegionFromCookie } from '../../helpers/region';

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