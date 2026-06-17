"use client";

import React, { useEffect, useState } from "react";
import { movieApi } from "../../services/movieApi";
import { Movie } from "../../types/movie";
import { MovieCard } from "../../components/MovieCard";
import { motion } from "framer-motion";
import { MovieCardSkeletonGrid } from "@/components/skeletons/MovieCardSkeleton";
import { Header } from "../../components/Header";
import { Tv, AlertCircle, RefreshCw } from "lucide-react";

// Popular default search terms rotated on each visit
const DEFAULT_QUERIES = ["Breaking Bad", "Game of Thrones", "Friends", "Stranger Things", "The Office"];

const TVShowsPage = () => {
    const [shows, setShows] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuery, setCurrentQuery] = useState("");

    const fetchShows = async (query: string) => {
        // Guard: don't call the API if the key is missing
        if (!process.env.NEXT_PUBLIC_OMDB_API_KEY) {
            setError(
                "OMDB API key is not configured. Please add NEXT_PUBLIC_OMDB_API_KEY to your .env.local file and restart the dev server."
            );
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await movieApi.searchTvShows(query);
            if (data.Response === "True" && data.Search) {
                setShows(data.Search);
            } else {
                setError(data.Error || "No TV shows found.");
                setShows([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "An error occurred while fetching data.";
            setError(message);
            setShows([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const query = DEFAULT_QUERIES[Math.floor(Math.random() * DEFAULT_QUERIES.length)];
        setCurrentQuery(query);
        fetchShows(query);
    }, []); // fetchShows is stable — defined outside effect scope

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen
                        bg-gradient-to-br from-pink-50 via-white to-rose-50
                        dark:from-[#2d0f1e] dark:via-[#3d1c2e] dark:to-[#2d0f1e]
                        relative overflow-hidden">

            {/* Blush blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96
                                bg-pink-200/30 dark:bg-pink-900/20
                                rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80
                                bg-rose-200/25 dark:bg-rose-900/15
                                rounded-full blur-3xl" />
            </div>

            <Header />

            <main className="container mx-auto px-6 pt-28 md:pt-32 pb-16 relative z-10">

                {/* ── Page heading ───────────────────────────── */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center
                                    w-14 h-14 mb-4
                                    bg-gradient-to-br from-pink-400 to-rose-400
                                    rounded-2xl shadow-lg shadow-pink-200/50">
                        <Tv className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3
                                   bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500
                                   dark:from-pink-300 dark:via-rose-300 dark:to-pink-400
                                   bg-clip-text text-transparent">
                        Discover TV Shows
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 dark:text-pink-300/70 max-w-xl mx-auto">
                        Browse the latest and greatest series from around the world.
                        {currentQuery && !isLoading && !error && (
                            <span className="block mt-1 text-sm text-pink-400 dark:text-pink-400">
                                Showing results for &ldquo;{currentQuery}&rdquo;
                            </span>
                        )}
                    </p>
                </div>

                {/* ── Content ────────────────────────────────── */}
                {/* Error state */}
                {error && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-lg mx-auto mt-8
                                   bg-white dark:bg-[#4a1e35]
                                   border border-pink-200 dark:border-pink-800/50
                                   rounded-2xl shadow-sm shadow-pink-100/50 p-8 text-center">
                        <div className="w-12 h-12 mx-auto mb-4
                                        bg-pink-100 dark:bg-pink-900/40
                                        rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-pink-500" />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-pink-100 mb-2">
                            Could not load TV shows
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-pink-300/70 mb-6 leading-relaxed">
                            {error}
                        </p>
                        {/* Only show retry if the key IS present (i.e. it's a network error) */}
                        {process.env.NEXT_PUBLIC_OMDB_API_KEY && (
                            <button
                                onClick={() => fetchShows(currentQuery)}
                                className="inline-flex items-center gap-2 px-5 py-2.5
                                           bg-gradient-to-r from-pink-400 to-rose-400
                                           hover:from-pink-500 hover:to-rose-500
                                           text-white rounded-xl font-semibold text-sm
                                           shadow-md shadow-pink-200/50
                                           transition-all duration-200">
                                <RefreshCw className="w-4 h-4" />
                                Try again
                            </button>
                        )}

                        {/* Show setup instructions if key is missing */}
                        {!process.env.NEXT_PUBLIC_OMDB_API_KEY && (
                            <div className="mt-4 p-4 bg-pink-50 dark:bg-pink-950/40
                                            rounded-xl border border-pink-200/60 dark:border-pink-800/40
                                            text-left text-xs text-gray-600 dark:text-pink-300/80
                                            font-mono space-y-1">
                                <p className="font-sans font-semibold text-pink-600 dark:text-pink-300 mb-2">
                                    Setup steps:
                                </p>
                                <p>1. Get a free key at <span className="text-pink-500">omdbapi.com/apikey.aspx</span></p>
                                <p>2. Add to <span className="text-pink-500">.env.local</span>:</p>
                                <p className="pl-3 text-rose-500">NEXT_PUBLIC_OMDB_API_KEY=your_key</p>
                                <p>3. Restart the dev server</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Loading skeleton */}
                {isLoading && <MovieCardSkeletonGrid count={10} />}

                {/* Results grid */}
                {!isLoading && !error && shows.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {shows.map((show, index) => (
                            <MovieCard key={show.imdbID} movie={show} index={index} />
                        ))}
                    </motion.div>
                )}

                {/* Empty state */}
                {!isLoading && !error && shows.length === 0 && (
                    <div className="text-center py-20 text-pink-300 dark:text-pink-500/50">
                        <Tv className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No shows found.</p>
                    </div>
                )}
            </main>
        </motion.div>
    );
};

export default TVShowsPage;
