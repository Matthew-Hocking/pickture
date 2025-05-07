import { RegionCode } from "../../constants";

export default async function fetchTMDBDataClient<T = any>(
  endpoint: string, 
  options: { 
    region?: RegionCode;
    [key: string]: any;
  } = {}
): Promise<T> {
  // Call your internal API route that proxies to TMDB
  const queryParams = new URLSearchParams(options as Record<string, string>);
  
  const response = await fetch(
    `/api/tmdb/${endpoint}?${queryParams.toString()}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}