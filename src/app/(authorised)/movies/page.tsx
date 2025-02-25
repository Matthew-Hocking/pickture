import React from 'react'
import { getUserRegion } from '@/app/lib/auth';
import { tmdb } from '@/app/lib/tmdb';

const Page = async () => {
  const region = await getUserRegion()

  const [
    discoverMovies,
    popularMovies,
    topRatedMovies
  ] = await Promise.all([
    tmdb.getDiscover('movie', {}, { region }),
    tmdb.getPopular('movie', {}, { region }),
    tmdb.getTopRated('movie', {}, { region })
  ])

  console.log('discoverMovies', discoverMovies)
  console.log('popularMovies', popularMovies)
  console.log('topRatedMovies', topRatedMovies)

  return (
    <div>
      Page
    </div>
  )
}

export default Page;
 