import { TvShowCastMember, TVShowDetails } from '@/app/lib/tmdb/types';
import React from 'react'

interface TvShowPageProps {
  data: {
    tvShow: TVShowDetails;
    topCast: TvShowCastMember[] | null;
    directors: {
      label: string;
      names: string;
    } | null;
    similar: TVShowDetails[];
    watchOptions: {
      provider_id: number;
      provider_name: string;
      link: string;
      logo_path: string;
      offers: Array<'Rent' | 'Buy' | 'Stream'>;
    }[];
  }
}

const TvShowPage = ({ data }: TvShowPageProps) => {
  return (
    <div>TvShowPage</div>
  )
}

export default TvShowPage