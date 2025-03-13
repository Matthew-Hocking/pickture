// 'use client'

import { List } from "@/app/components/ui";
import { useRegion } from "@/app/context/RegionContext";
import { tmdb } from "@/app/lib/tmdb";
import React from "react";


const Page = async () => {
  // const { region } = useRegion();

  const [ topRatedMovies ] = await Promise.all([
    tmdb.getTopRated("movie", {}, { region: 'NZ' })
  ])

  return (
    <div>
      <List results={topRatedMovies.results} />
    </div>
  )
};

export default Page;
