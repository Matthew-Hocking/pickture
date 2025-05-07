'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { debounce } from 'lodash';
import fetchTMDBDataClient from '@/app/lib/tmdb/client/tmdb-client';
import { Search } from 'lucide-react';
import { MediaItem } from '@/app/lib/tmdb/types';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const [moviesData, tvData] = await Promise.all([
        fetchTMDBDataClient('search/movie', { query: q }),
        fetchTMDBDataClient('search/tv', { query: q }),
      ]);

      const movies = (moviesData.results || []).slice(0, 3).map((item: any) => ({
        ...item,
        media_type: 'movie',
      }));

      const tvShows = (tvData.results || []).slice(0, 3).map((item: any) => ({
        ...item,
        media_type: 'tv',
      }));

      setResults([...movies, ...tvShows]);
      setShowDropdown(true);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setResults([]);
      setShowDropdown(false);
    }
  };

  // Debounced version for input typing
  useEffect(() => {
    const debounced = debounce(search, 300);
    if (query.trim()) debounced(query);
    else {
      setResults([]);
      setShowDropdown(false);
    }
    return () => debounced.cancel();
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search movies or tv"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-full border border-gray-300 px-4 py-2"
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-brand text-white hover:bg-brand-hover"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 z-10">
          <ul>
            {results.map((item) => {
              const name = item.title || item.name;
              const year = (item.release_date || item.first_air_date || '').slice(0, 4);
              return (
                <li key={`${item.media_type}-${item.id}`} className="px-4 py-2 hover:bg-gray-100">
                  <Link href={`/${item.media_type}/${item.id}`}>
                    <span>{name} {year && `(${year})`}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="border-t px-4 py-2 text-sm text-blue-600 hover:underline">
            <Link href={`/search?q=${encodeURIComponent(query)}`}>See all results</Link>
          </div>
        </div>
      )}
    </div>
  );
}