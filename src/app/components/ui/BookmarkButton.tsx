'use client';

import { Plus, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import cn from "classnames";

interface BookmarkButtonProps {
  id: number;
  initialBookmarked?: boolean;
}

const BookmarkButton = ({ id, initialBookmarked = false }: BookmarkButtonProps) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      if (bookmarked) {
        const res = await fetch("/api/user/movies/delete/", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tmdbId: id})
        });

        if (!res.ok) throw new Error("Failed to delete movie");
      } else {
        const res = await fetch("/api/user/movies/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tmdbId: id }),
        });

        if (!res.ok) throw new Error("Failed to save movie");
      }

      setBookmarked(!bookmarked);
    } catch (error) {
      console.error("Error saving/removing bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!loading) toggleBookmark();
      }}
      className={cn(
        "absolute top-0 left-2 z-10 w-6 h-8 shadow-md text-black flex items-center justify-center transition-colors opacity-50 hover:opacity-100",
        bookmarked ? "bg-brand" : "bg-border"
      )}
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
      }}
    >
      {bookmarked ? <Check size={14} color="#FFF" /> : <Plus size={14} color="#FFF" />}
    </button>
  );
};

export default BookmarkButton;