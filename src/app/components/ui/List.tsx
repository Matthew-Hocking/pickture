'use client'

import React from "react";
import {
  MovieDetails,
  TVDetails,
} from "@/app/lib/tmdb/types";

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Navigation } from "swiper/modules";

interface ListProps {
  results: (MovieDetails | TVDetails)[];
}

const List: React.FC<ListProps> = ({ results }) => {
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination]}
        centeredSlides={false}
        spaceBetween={50}
        slidesPerView={6}
        slidesPerGroupSkip={5}
        navigation
        pagination={{ clickable: false }}
      >
        {results.map((item) => (
          <SwiperSlide key={item.id} className="w-48">
            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={("title" in item ? item.title : item.name) || "Poster"}
                className="w-full h-72 object-cover"
              />
              <div className="p-2 text-white text-sm">
                <p className="font-semibold">
                  {"title" in item ? item.title : item.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {"release_date" in item ? item.release_date : item.first_air_date}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default List;
