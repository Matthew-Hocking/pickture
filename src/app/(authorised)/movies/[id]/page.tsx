import { fetchMovieBundle, fetchTMDBData } from '@/app/lib/tmdb/server/tmdb-server';
import { Metadata } from 'next';
import { MoviePage } from '@/app/components/pages';
import { notFound } from 'next/navigation';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  try {
    const { id } = await params;
    const movie = await fetchTMDBData(`movie/${id}`);

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

    const movieBundleData = await fetchMovieBundle(id);
    
    return (
      <MoviePage data={movieBundleData}/>
    );
  } catch (error) {
    console.error('Error loading movie page:', error);
    notFound();
  }
}