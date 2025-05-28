import { getRegionFromCookie } from '@/app/lib/helpers/region';
import { fetchTMDBData } from '@/app/lib/tmdb/server/tmdb-server';
import { Metadata } from 'next';
import { MovieCredits, MovieDetails, TMDBResponse, TMDBWatchProvidersResponse } from '@/app/lib/tmdb/types';
import { getDirectorNames } from '@/app/lib/helpers/directors';
import { MoviePage } from '@/app/components/pages';
import { notFound } from 'next/navigation';
import { transformWatchProviders } from '@/app/lib/helpers/provider-link';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  try {
    const { id } = await params;
    const region = await getRegionFromCookie();
    const movie = await fetchTMDBData(`movie/${id}`, { region });

    return {
      title: `${movie.title} | Pickture`,
      description: movie.overview || 'Movie details on Pickture',
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.poster_path
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Movie | Pickture',
      description: 'Movie details',
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const region = await getRegionFromCookie();

    const [movie, credits, similar, providers] = await Promise.all([
      fetchTMDBData(`movie/${id}`) as Promise<MovieDetails>,
      fetchTMDBData(`movie/${id}/credits`) as Promise<MovieCredits>,
      fetchTMDBData(`movie/${id}/similar`) as Promise<TMDBResponse>,
      fetchTMDBData(`movie/${id}/watch/providers`) as Promise<TMDBWatchProvidersResponse>,
    ]);
    
    const topCast = credits?.cast?.slice(0, 6) || [];
    const directors = credits?.crew?.filter((member) => member.job === 'Director') || [];
    const directorInfo = getDirectorNames(directors);
    const regionSpecificProviders = providers.results[region]
    const watchOptions = transformWatchProviders(regionSpecificProviders, movie.title, region)
    
    return (
      <MoviePage
        movie={movie}
        topCast={topCast}
        directors={directorInfo}
        similar={similar.results}
        watchOptions={watchOptions}
      />
    );
  } catch (error) {
    console.error('Error loading movie page:', error);
    notFound();
  }
}