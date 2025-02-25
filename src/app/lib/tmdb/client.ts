import { DiscoverParams, MovieDetails, PaginatedResponse, TMDBOptions, TVDetails } from "./types";

export class TMDBClient {
  private baseURL = process.env.TMDB_BASE_URL;
  private options: TMDBOptions;

  constructor(options: TMDBOptions) {
    if (!options.api_key) {
      throw new Error('TMDB API key is required');
    }

    this.options = {
      language: 'en-US',
      region: 'US',
      ...options
    }
  }

  setRegion(region: string) {
    this.options.region = region;
  }

  getRegion(): string {
    return this.options.region!;
  }

  private fetchOptions(revalidate?: number): RequestInit {
    return {
      next: {
        revalidate: revalidate ?? 3600
      },
      headers: {
        'Authorization': `Bearer ${this.options.api_key}`,
        'Content-Type': 'application/json'
      }
    }
  }

  private async fetch<T>(
    endpoint: string, 
    params: Record<string, any> = {},
    options?: {
      revalidate?: number | false;
      region?: string;
    }
  ): Promise<T> {
    const queryParams = new URLSearchParams({
      language: this.options.language!,
      region: options?.region || this.options.region!,
      ...params
    })

    const fetchOpts = options?.revalidate === false
      ? {
          ...this.fetchOptions(),
          cache: 'no-store' as RequestCache
        }
      : this.fetchOptions(options?.revalidate);

    try {
      const response = await fetch(
        `${this.baseURL}${endpoint}?${queryParams}`,
        fetchOpts
      )

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`TMDB API  error: ${error.status_message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An error occurred while fetching from TMDB')
    }
  }

  async getDiscover(
    mediaType: "movie" | "tv",
    params: DiscoverParams = {},
    options?: { revalidate?: number; region?: string }
  ): Promise<PaginatedResponse<MovieDetails | TVDetails>> {
    return this.fetch(`/discover/${mediaType}`, params, options);
  }

  async getPopular(
    mediaType: "movie" | "tv",
    params: DiscoverParams = {},
    options?: { revalidate?: number; region?: string }
  ): Promise<PaginatedResponse<MovieDetails | TVDetails>> {
    return this.fetch(`/${mediaType}/popular`, params, options)
  }

  async getTopRated(
    mediaType: "movie" | "tv",
    params: DiscoverParams = {},
    options?: { revalidate?: number; region?: string }
  ): Promise<PaginatedResponse<MovieDetails | TVDetails>> {
    return this.fetch(`/${mediaType}/top_rated`, params, options)
  }
}