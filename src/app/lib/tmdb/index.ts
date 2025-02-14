import { TMDBClient } from './client';

export const tmdb = new TMDBClient({
  api_key: process.env.TMDB_API_READ_ACCESS_TOKEN!
})