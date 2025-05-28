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
import { ChevronRight, ChevronLeft } from "lucide-react";
import cn from "classnames";
import BookmarkButton from "./BookmarkButton";

type WithBookmark<T> = T & { bookmarked?: boolean };

interface ListProps {
  results: (WithBookmark<MovieDetails> | WithBookmark<TVDetails>)[];
  onClick?: (id: number) => void;
}

const List = ({ results, onClick }: ListProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSlides, setActiveSlides] = useState<number[]>([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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

            return (
              <SwiperSlide key={item.id} className="w-48 select-none relative">
                <div
                  className={cn(
                    "transition-transform duration-300 hover:cursor-pointer relative",
                    isActive ? "hover:scale-105" : "grayscale opacity-50 pointer-events-none"
                  )}
                  onClick={() => isActive && onClick?.(item.id)}
                >
                  {/* Bookmark button for saving */}
                  <BookmarkButton id={item.id} initialBookmarked={item.bookmarked}/>

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
