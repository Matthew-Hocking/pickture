import { DiscoverParams, MovieDetails, PaginatedResponse, TMDBOptions } from "./types";

export class TMDBClient {
  private basURL = process.env.TMDB_BASE_URL;
  private options: TMDBOptions;

  constructor(options: TMDBOptions) {
    this.options = {
      language: 'en-US',
      region: 'US',
      ...options
    }
  }

  private fetchOptions(): RequestInit {
    return {
      next: {
        revalidate: 3600
      },
      headers: {
        'Authorization': `Bearer ${this.options.api_key}`,
        'Content-Type': 'application/json'
      }
    }
  }

  private async fetch<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const queryParams = new URLSearchParams({
      language: this.options.language!,
      ...params
    })

    const response = await fetch(
      `${this.basURL}${endpoint}?${queryParams}`,
      this.fetchOptions()
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async discoverMovies(params: DiscoverParams): Promise<PaginatedResponse<MovieDetails>> {
    return this.fetch('/discover/movie', params)
  }

}