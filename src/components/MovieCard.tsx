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
      <Card className="overflow-hidden h-full flex flex-col
                       bg-white dark:bg-[#4a1e35]
                       border border-pink-100 dark:border-pink-900/50
                       hover:border-pink-300 dark:hover:border-pink-600/60
                       shadow-sm hover:shadow-lg hover:shadow-pink-100/60
                       transition-all duration-300 rounded-2xl">

        {/* ── Poster ─────────────────────────────────────── */}
        <div className="aspect-[2/3] relative overflow-hidden flex-shrink-0
                        bg-gradient-to-br from-pink-50 to-rose-50
                        dark:from-pink-950/60 dark:to-rose-950/60
                        rounded-t-2xl">
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
              {/* Soft pink gradient overlay on hover */}
              <div className="absolute inset-0
                              bg-gradient-to-t from-pink-900/50 via-pink-900/10 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            /* No-poster placeholder */
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-14 h-14 mx-auto mb-3
                                bg-gradient-to-br from-pink-200 to-rose-200
                                dark:from-pink-800/50 dark:to-rose-800/50
                                rounded-full flex items-center justify-center">
                  <Film className="w-7 h-7 text-pink-400 dark:text-pink-300" />
                </div>
                <p className="text-xs font-semibold text-pink-500 dark:text-pink-300 line-clamp-2">
                  {movie.Title}
                </p>
                <p className="text-xs text-pink-300 dark:text-pink-500 mt-1">{movie.Year}</p>
              </div>
            </div>
          )}

          {/* View Details button — appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-300 z-10">
            <Link href={`/movies/${movie.imdbID}`}>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5
                           bg-white/95 text-pink-600
                           rounded-full font-semibold text-sm
                           shadow-lg shadow-pink-200/50
                           hover:bg-pink-50 transition-colors">
                <Eye className="w-4 h-4" />
                View Details
              </motion.button>
            </Link>
          </div>

          {/* Top-left: Watchlist */}
          <div className="absolute top-2 left-2 z-20">
            <WatchlistButton movie={movie} size="sm" />
          </div>

          {/* Top-right: Share */}
          <div className="absolute top-2 right-2 z-20">
            <ShareButton movie={movie} size="sm" />
          </div>

          {/* User rating badge */}
          {isHydrated && userRating > 0 && (
            <div className="absolute bottom-2 right-2 z-20
                            bg-gradient-to-r from-pink-400 to-rose-400
                            text-white px-2 py-0.5 rounded-full
                            text-xs font-bold shadow-md">
              ♥ {userRating}/5
            </div>
          )}
        </div>

        {/* ── Card footer ────────────────────────────────── */}
        <div className="p-3 flex flex-col gap-1.5 flex-1
                        bg-white dark:bg-[#4a1e35]">
          <h3 className="text-sm font-bold leading-snug line-clamp-2
                         text-gray-800 dark:text-pink-100">
            {movie.Title}
          </h3>

          <p className="text-xs text-pink-400 dark:text-pink-400">
            {movie.Year}
            {movie.Type && movie.Type !== "movie" && (
              <span className="ml-1.5 capitalize text-rose-400 dark:text-rose-400">
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
