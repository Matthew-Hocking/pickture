import { TvShowPage } from "@/app/components/pages";
import { fetchTMDBData, fetchTvShowBundle } from "@/app/lib/tmdb/server/tmdb-server";
import { TVShowDetails } from "@/app/lib/tmdb/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  try {
    const { id } = await params;
    const tvShow = await fetchTMDBData<TVShowDetails>(`tv/${id}`);

    return {
      title: `${tvShow.name} | Pickture`,
      description: tvShow.overview || 'TV show details on Pickture',
      openGraph: {
        title: tvShow.name,
        description: tvShow.overview,
        images: tvShow.poster_path
          ? [`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`]
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
  params
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const { id } = await params;

    const tvShowBundleData = await fetchTvShowBundle(id);

    return (
      <TvShowPage data={tvShowBundleData} />
    )
  } catch (error) {
    console.error('Error loading movie page:', error);
    notFound();
  }
}