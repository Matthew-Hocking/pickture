import React from 'react'
import { tmdb } from '@/app/lib/tmdb'

const Page = async () => {
  const discoverMovies = await tmdb.discoverMovies({})
  console.log(discoverMovies)
  return (
    <>
      <div>Page</div>
    </>
  )
}

export default Page;
