"use client";

import React, { useState, useEffect } from "react";
import { Movie } from "../types/movie";
import { Card } from "./ui/Card";
import { StarRating } from "./ui/StarRating";
import { WatchlistButton } from "./WatchlistButton";
import { Film, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLocalStorage } from "../hooks/useDebounce";
import { ShareButton } from "./ShareButton";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  const [userRatings, setUserRatings] = useLocalStorage<
    Array<{ movieId: string; rating: number }>
  >("userRatings", []);
  const [imageError, setImageError] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const userRating = isHydrated
    ? userRatings.find((r) => r.movieId === movie.imdbID)?.rating || 0
    : 0;

  const handleRating = (rating: number) => {
    const existingIndex = userRatings.findIndex(
      (r) => r.movieId === movie.imdbID
    );
    const newRatings = [...userRatings];

    if (existingIndex >= 0) {
      newRatings[existingIndex] = { movieId: movie.imdbID, rating };
    } else {
      newRatings.push({ movieId: movie.imdbID, rating });
    }

    setUserRatings(newRatings);
  };

  const hasPoster = movie.Poster && movie.Poster !== "N/A" && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5), ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="h-full group relative movie-card-hover"
    >
      <Card className="overflow-hidden h-full shadow-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-red-500/50 transition-all duration-300 flex flex-col">
        {/* Poster area */}
        <div className="aspect-[2/3] relative bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden flex-shrink-0">
          {hasPoster ? (
            <>
              <Image
                src={movie.Poster}
                alt={movie.Title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                priority={index < 6}
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
                  <Film className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-300 line-clamp-2">
                  {movie.Title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{movie.Year}</p>
              </div>
            </div>
          )}

          {/* View Details hover button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Link href={`/movies/${movie.imdbID}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/95 text-gray-900 rounded-full font-semibold text-sm shadow-lg hover:bg-white transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </motion.button>
            </Link>
          </div>

          {/* Top-left: Watchlist button */}
          <div className="absolute top-2 left-2 z-20">
            <WatchlistButton movie={movie} size="sm" />
          </div>

          {/* Top-right: Share button */}
          <div className="absolute top-2 right-2 z-20">
            <ShareButton movie={movie} size="sm" />
          </div>

          {/* User rating badge — bottom-right, only when rated */}
          {isHydrated && userRating > 0 && (
            <div className="absolute bottom-2 right-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
              ⭐ {userRating}/5
            </div>
          )}
        </div>

        {/* Card footer */}
        <div className="p-3 flex flex-col gap-2 flex-1">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
            {movie.Title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {movie.Year}
            {movie.Type && movie.Type !== "movie" && (
              <span className="ml-1.5 capitalize text-purple-500 dark:text-purple-400">
                · {movie.Type}
              </span>
            )}
          </p>

          {/* Star rating */}
          <div className="mt-auto pt-1">
            <StarRating
              rating={userRating}
              onRatingChange={handleRating}
              size="sm"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
