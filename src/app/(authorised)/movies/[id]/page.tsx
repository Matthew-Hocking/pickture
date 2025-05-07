import { getRegionFromCookie } from '@/app/lib/helpers/region';
import { fetchTMDBData } from '@/app/lib/tmdb/server/tmdb-server';
import { Metadata, ResolvingMetadata } from 'next';


type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { id } = await params
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

export default async function MoviePage(
  { params } : { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;
    const region = await getRegionFromCookie();
    const movie = await fetchTMDBData(`movie/${id}`, { region });

    return (
      <div>
        <h1 className="text-2xl font-bold">{movie.title}</h1>
        <p className="text-text-secondary mt-2">{movie.overview}</p>
      </div>
    );
  } catch (error) {
    console.error('Error loading movie:', error);
    return <div>Error loading movie details. Please try again later.</div>;
  }
}