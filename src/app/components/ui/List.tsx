'use client'

import React, { useRef, useState } from "react";
import {
  MovieDetails,
  TVDetails,
} from "@/app/lib/tmdb/types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from 'swiper/types'
import 'swiper/css';
import 'swiper/css/navigation';
import Button from "./Button";
import { ChevronRight, ChevronLeft, Plus, Check } from "lucide-react";
import cn from "classnames";

interface ListProps {
  results: (MovieDetails | TVDetails)[];
  onClick?: (id: number) => void;
}

const List = ({ results, onClick }: ListProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSlides, setActiveSlides] = useState<number[]>([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());

  const updateVisibleSlides = (swiper: SwiperType) => {
    const { activeIndex, params } = swiper;
    const groupSize = params.slidesPerGroup || 1;
    const indices = Array.from({ length: groupSize }, (_, i) => activeIndex + i);
    setActiveSlides(indices);
  };

  const updateNavigationState = (swiper: SwiperType) => {
    setAtStart(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
    updateVisibleSlides(swiper);
  };

  const toggleBookmark = async (id: number) => {
    const isBookmarked = bookmarkedIds.has(id);

    try {
      if (isBookmarked) {
        await fetch(`/api/user/movies/${id}`, {
          method: 'DELETE',
        });
      } else {
        const res = await fetch('/api/user/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tmdbId: id }),
        });

        if (!res.ok) throw new Error('Failed to save movie');
      }

      setBookmarkedIds(prev => {
        const newSet = new Set(prev);
        isBookmarked ? newSet.delete(id) : newSet.add(id);
        return newSet;
      });
    } catch (error) {
      console.error('Error saving/removing movie:', error);
    }
  };

  return (
    <div>
      <div className="relative overflow-visible">
        <Swiper
          spaceBetween={10}
          slidesPerView={2}
          slidesPerGroup={2}
          centeredSlides={false}
          simulateTouch={true}
          breakpoints={{
            480: {
              slidesPerView: 3,
              slidesPerGroup: 3
            },
            640: {
              slidesPerView: 4,
              slidesPerGroup: 4
            },
            768: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              simulateTouch: false
            },
            1024: {
              slidesPerView: 6,
              slidesPerGroup: 6,
              simulateTouch: false
            },
            1280: {
              slidesPerView: 7,
              slidesPerGroup: 7,
              simulateTouch: false
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateNavigationState(swiper);
          }}
          onSlideChange={(swiper) => updateNavigationState(swiper)}
          className="!overflow-visible"
        >
          {results.map((item, index) => {
            const isActive = activeSlides.includes(index);
            const isBookmarked = bookmarkedIds.has(item.id);

            return (
              <SwiperSlide key={item.id} className="w-48 select-none relative">
                <div
                  className={cn(
                    "transition-transform duration-300 hover:cursor-pointer relative",
                    isActive ? "hover:scale-105" : "grayscale opacity-50 pointer-events-none"
                  )}
                  onClick={() => isActive && onClick?.(item.id)}
                >
                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(item.id);
                    }}
                    className={cn("absolute top-0 left-2 z-10 w-6 h-8 shadow-md text-black flex items-center justify-center transition-colors opacity-50 hover:opacity-100",
                        isBookmarked ? "bg-brand" : "bg-border"
                      )}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
                    }}
                  >
                    {isBookmarked ? <Check size={14} color="#FFF"/> : <Plus size={14} color="#FFF"/>}
                  </button>

                  {/* Poster */}
                  <div className="rounded-md overflow-hidden shadow-lg aspect-[2/3]">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={("title" in item ? item.title : item.name) || "Poster"}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>       
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={atStart}
          variant="ghost"
          size="icon"
        >
          <ChevronLeft size={35}/>
        </Button>
        <Button
          onClick={() => swiperRef.current?.slideNext()}
          disabled={atEnd}
          variant="ghost"
          size="icon"
        >
          <ChevronRight size={35}/>
        </Button>
      </div>
    </div>
  );
};

export default List;
