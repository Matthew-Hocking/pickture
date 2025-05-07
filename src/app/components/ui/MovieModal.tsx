'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MovieDetails } from "@/app/lib/tmdb/types";

type MovieModalProps = {
  id: string;
  onClose: () => void;
};

export default function MovieModal({ id, onClose }: MovieModalProps) {
  const [data, setData] = useState<MovieDetails | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`/api/tmdb/details?type=movie&id=${id}`);
      const json = await res.json();
      setData(json);
    };

    fetchDetails();
  }, [id]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3">X</button>
        {!data ? (
          <div>Loading...</div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2">{data.title}</h2>
            <p className="text-sm text-gray-700">{data.overview}</p>
            {/* Add more movie info here */}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}