// src/app/movies/page.tsx

"use client";

import React, { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // To read URL genre parameter
import { Header } from "../../components/Header";
import { SearchBar, SearchBarRef } from "../../components/SearchBar";
import { MovieGrid } from "../../components/MovieGrid";
import { ActorGrid } from "../../components/ActorGrid";
import {
	LoadingSkeleton,
	ErrorState,
	EmptyState,
} from "../../components/LoadingStates"; // Ensure these paths are correct
import { useMoviesWithGenreFilter } from "../../hooks/useMovieQueries"; // Your custom hooks
import {
	useCombinedSearch,
	useInfiniteMoviesByActor,
} from "../../hooks/useActorQueries";
import { useDebounce } from "../../hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, User } from "lucide-react";
import { MOVIE_GENRES } from "../../lib/constants";

// Component that uses useSearchParams (needs to be wrapped in Suspense)
function MoviesPageContent() {
	// State for SearchBar input and filters
	const [searchQuery, setSearchQuery] = useState("");
	const [year, setYear] = useState("");
	const [genre, setGenre] = useState("all"); // Default to 'all'
	const [searchType, setSearchType] = useState<"movie" | "actor" | "both">(
		"both"
	);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const searchBarRef = useRef<SearchBarRef>(null);

	const searchParams = useSearchParams();
	const urlGenreParam = searchParams.get("genre");

	// Sync URL genre param with component state on initial load
	useEffect(() => {
		if (urlGenreParam && urlGenreParam !== "all" && genre !== urlGenreParam) {
			setGenre(urlGenreParam);
			// Optionally set searchQuery to genreParam if you want genre selection to act as a search
			setSearchQuery(urlGenreParam);
			// Show toast notification
			setToastMessage(`🎬 Exploring ${urlGenreParam} movies...`);
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);
		} else if (!urlGenreParam && searchQuery !== "") {
			// If URL genre is cleared but search query is active, reset genre filter
			setGenre("all");
		}
	}, [urlGenreParam, genre, searchQuery]); // Add searchQuery to dependencies

	// Debounce the search query for efficient API calls
	const debouncedQuery = useDebounce(searchQuery, 500);

	// Auto-detect actor searches and adjust search type
	useEffect(() => {
		if (debouncedQuery.trim()) {
			const isActorSearchQuery =
				/^(movies?|films?)\s+by\s+/i.test(debouncedQuery) ||
				/^(actor|actress)\s+/i.test(debouncedQuery) ||
				debouncedQuery.toLowerCase().includes("by");

			if (isActorSearchQuery && searchType !== "actor") {
				setSearchType("actor");
			}
		}
	}, [debouncedQuery, searchType]);

	// Combined search logic for both movies and actors
	const {
		movies: movieData,
		actors: actorData,
		isLoading: isCombinedLoading,
		error: combinedError,
	} = useCombinedSearch(debouncedQuery, searchType);

	// Actor-specific search for movies by actor
	const {
		data: actorMoviesData,
		isLoading: isActorMoviesLoading,
		error: actorMoviesError,
		fetchNextPage: fetchNextActorMovies,
		hasNextPage: hasNextActorMovies,
		isFetchingNextPage: isFetchingNextActorMovies,
	} = useInfiniteMoviesByActor(searchType === "actor" ? debouncedQuery : "");

	// Determine which data to use based on search type
	const isActorSearch = searchType === "actor" && debouncedQuery.trim();
	const isMovieSearch = searchType === "movie" || searchType === "both";

	// Use actor movies data if searching for actors, otherwise use combined search
	const data = isActorSearch ? actorMoviesData : undefined;
	const isLoading = isActorSearch ? isActorMoviesLoading : isCombinedLoading;
	const error = isActorSearch ? actorMoviesError : combinedError;
	const fetchNextPage = isActorSearch ? fetchNextActorMovies : undefined;
	const hasNextPage = isActorSearch ? hasNextActorMovies : undefined;
	const isFetchingNextPage = isActorSearch
		? isFetchingNextActorMovies
		: undefined;

	// Reset search state — clears results without a hard page reload
	const refetch = () => {
		setSearchQuery("");
		setYear("");
		setGenre("all");
		setSearchType("both");
	};

	// Flatten all pages into a single array of movies (memoized)
	const allMovies = useMemo(() => {
		if (isActorSearch) {
			return data?.pages.flatMap((page) => page.Search || []) || [];
		} else {
			return movieData?.Search || [];
		}
	}, [data, movieData, isActorSearch]);

	// Apply client-side genre filtering on the fetched movies
	const { filteredMovies, isFiltering } = useMoviesWithGenreFilter(
		allMovies,
		genre // Use the genre state for client-side filtering
	);

	// Movies to display after all processing
	const moviesToDisplay = filteredMovies;

	// Calculate total results based on original data (if no client-side genre filter active)
	// or based on filtered count (if client-side genre filter is active)
	const totalResults =
		genre !== "all"
			? moviesToDisplay.length.toString() // If genre is active, total is current filtered count
			: data?.pages[0]?.totalResults || "0"; // Otherwise, use API's total results

	const hasResults = moviesToDisplay.length > 0;
	const hasQuery = searchQuery.trim().length > 0; // Use direct searchQuery for 'hasQuery' check
	const isLoadingContent = isLoading || isFiltering; // Combine loading states

	// Update document title dynamically
	useEffect(() => {
		const baseTitle = "Movies & TV Series";
		if (searchQuery.trim() || genre !== "all") {
			const queryPart = searchQuery.trim() ? `"${searchQuery.trim()}"` : "";
			const genrePart =
				genre !== "all"
					? `(${MOVIE_GENRES.find((g) => g.value === genre)?.label} Genre)`
					: "";
			document.title =
				`${queryPart} ${genrePart}`.trim() + ` | ${baseTitle} | CineVerse`;
		} else {
			document.title = `${baseTitle} | CineVerse`;
		}
	}, [searchQuery, genre]);

	const handleClearFilters = () => {
		setSearchQuery(""); // Clear search input
		setYear(""); // Clear year filter
		setGenre("all"); // Reset genre filter
		setSearchType("both"); // Reset search type
		refetch(); // Trigger a refetch to clear previous search results
		searchBarRef.current?.focus(); // Focus the search bar
	};

	// Handler for suggested clicks from EmptyState.
	const handleSuggestionClick = (
		suggestion: string,
		type?: "movie" | "actor"
	) => {
		setSearchQuery(suggestion);
		setYear("");
		setGenre("all"); // Clear filters when a suggestion is clicked
		if (type) {
			setSearchType(type);
		}
		setToastMessage(`🎬 Searching for "${suggestion}"...`);
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
		// `debouncedQuery` will pick this up and the appropriate search will trigger.
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden'>
			{/* Background Pattern */}
			<div className='absolute inset-0 opacity-10 dark:opacity-5'>
				<div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%)]'></div>
				<div className='absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(255,119,198,0.3),_transparent_50%)]'></div>
				<div className='absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_40%,_rgba(120,200,255,0.3),_transparent_50%)]'></div>
			</div>

			<Header onSearchClick={() => searchBarRef.current?.focus()} />
			<main className='container mx-auto px-4 py-8 pt-28 md:pt-32 relative z-10'>
				<div className='max-w-7xl mx-auto'>

					{/* Hero Section */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className='text-center mb-10 md:mb-14'>
						<h1 className='text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight'>
							<span className='bg-gradient-to-r from-red-500 via-rose-500 to-purple-600 dark:from-red-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent'>
								Discover
							</span>
							{" "}
							<span className='text-gray-900 dark:text-white'>
								great films
							</span>
						</h1>
						<p className='text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto'>
							Search millions of movies, TV series, and episodes — then track, rate, and share what you love.
						</p>
					</motion.div>

					{/* Search and Filters */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}>
						<SearchBar
							ref={searchBarRef}
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder='Search for movies, TV series, episodes, or actors...'
							year={year}
							genre={genre}
							searchType={searchType}
							onYearChange={setYear}
							onGenreChange={setGenre}
							onSearchTypeChange={setSearchType}
							onClearFilters={handleClearFilters}
						/>
					</motion.div>

					{/* Results Section */}
					<AnimatePresence mode='wait'>
						{isLoadingContent ? (
							<LoadingSkeleton type='grid' count={10} />
						) : error ? (
							<ErrorState
								title='Failed to load movies'
								message='There was an error loading the movies. Please check your connection and try again.'
								onRetry={() => refetch()}
							/>
						) : !hasQuery && !urlGenreParam ? ( // Only show empty state if no query and no genre param in URL
							<EmptyState onSuggestionClick={handleSuggestionClick} />
						) : !hasResults ? (
							<EmptyState
								query={searchQuery || urlGenreParam || ""}
								onSuggestionClick={handleSuggestionClick}
							/>
						) : (
							<>
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4 }}
									className='mb-6 flex flex-wrap items-center gap-3 justify-between px-4 py-3 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-xl'>
									<div className='flex items-center gap-4 flex-wrap'>
										<span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
											<span className='font-bold text-gray-900 dark:text-white'>{moviesToDisplay.length}</span>
											{" "}of{" "}
											<span className='font-bold text-gray-900 dark:text-white'>{totalResults}</span>
											{" "}results
										</span>
										{actorData && actorData.length > 0 && searchType !== "movie" && (
											<span className='text-sm text-gray-500 dark:text-gray-400'>
												·{" "}
												<span className='font-semibold text-purple-600 dark:text-purple-400'>{actorData.length} actors</span>
											</span>
										)}
										{(searchQuery.trim() || urlGenreParam) && (
											<span className='text-sm text-gray-500 dark:text-gray-400 italic'>
												for &ldquo;{searchQuery.trim() || urlGenreParam}&rdquo;
											</span>
										)}
									</div>
									<div className='flex items-center gap-2'>
										<label className='text-sm text-gray-500 dark:text-gray-400'>Sort:</label>
										<select className='premium-select px-3 py-1.5 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500/50 transition-all duration-200'>
											<option value='relevance'>Relevance</option>
											<option value='year'>Year</option>
											<option value='rating'>Rating</option>
										</select>
									</div>
								</motion.div>

								{/* Genre Filtering Note */}
								{genre !== "all" && !isFiltering && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className='mb-6 p-4 bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-500/10 dark:to-pink-500/10 backdrop-blur-sm rounded-xl border border-purple-200/50 dark:border-purple-500/20'>
										<div className='flex items-center gap-3'>
											<div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
												<Tag className='w-4 h-4 text-white' />
											</div>
											<div>
												<p className='text-sm font-medium text-purple-700 dark:text-purple-300'>
													Filtered by genre:{" "}
													{MOVIE_GENRES.find((g) => g.value === genre)?.label}
												</p>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													Results are filtered client-side after fetching movie
													details
												</p>
											</div>
										</div>
									</motion.div>
								)}

								{/* Display Movies */}
								{moviesToDisplay.length > 0 && (
									<MovieGrid movies={moviesToDisplay} />
								)}

								{/* Display Actors */}
								{actorData &&
									actorData.length > 0 &&
									searchType !== "movie" && (
										<div className='mt-10'>
											<div className='mb-5 flex items-center gap-3'>
												<div className='w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0'>
													<User className='w-4 h-4 text-white' />
												</div>
												<div>
													<h2 className='text-lg font-bold text-gray-900 dark:text-white'>Actors Found</h2>
													<p className='text-xs text-gray-500 dark:text-gray-400'>{actorData.length} matching your search</p>
												</div>
											</div>
											<ActorGrid
												actors={actorData}
												onActorClick={(actor) => {
													setSearchQuery(actor.name);
													setSearchType("actor");
													setToastMessage(
														`🎭 Searching for movies by ${actor.name}...`
													);
													setShowToast(true);
													setTimeout(() => setShowToast(false), 3000);
												}}
											/>
										</div>
									)}

								{/* Load More Button */}
								{/* Only show load more if not currently filtering by genre (as pagination breaks with client-side filtering) */}
								{hasNextPage && genre === "all" && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.4 }}
											className='flex flex-col items-center mt-10 gap-4'>
											{/* Progress bar */}
											<div className='w-full max-w-md'>
												<div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5'>
													<span>{moviesToDisplay.length} loaded</span>
													<span>{totalResults} total</span>
												</div>
												<div className='w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden'>
													<motion.div
														initial={{ width: 0 }}
														animate={{
															width: `${(moviesToDisplay.length / parseInt(totalResults)) * 100}%`,
														}}
														transition={{ duration: 0.6, ease: "easeOut" }}
														className='h-full bg-gradient-to-r from-red-500 to-purple-500 rounded-full'
													/>
												</div>
											</div>

											<motion.button
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.97 }}
												onClick={() => fetchNextPage?.()}
												disabled={isFetchingNextPage}
												className='flex items-center gap-3 px-7 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'>
												{isFetchingNextPage ? (
													<>
														<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
														Loading...
													</>
												) : (
													<>
														Load more
														<span className='bg-white/20 px-2 py-0.5 rounded-full text-xs'>
															+{Math.min(10, parseInt(totalResults) - moviesToDisplay.length)}
														</span>
													</>
												)}
											</motion.button>
										</motion.div>
									)}

								{hasResults && !hasNextPage && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.4 }}
										className='text-center mt-12 py-8 border-t border-gray-200/50 dark:border-white/10'>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											Showing all{" "}
											<span className='font-semibold text-gray-700 dark:text-gray-200'>{moviesToDisplay.length}</span>{" "}
											results
										</p>
									</motion.div>
								)}
							</>
						)}
					</AnimatePresence>
				</div>
			</main>

			<AnimatePresence>
				{showToast && (
					<motion.div
						initial={{ opacity: 0, y: 50, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 50, scale: 0.95 }}
						transition={{ duration: 0.25 }}
						className='fixed bottom-6 right-6 z-50'>
						<div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl px-5 py-3.5 flex items-center gap-3 max-w-xs'>
							<div className='w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0' />
							<span className='text-gray-800 dark:text-gray-100 font-medium text-sm'>
								{toastMessage}
							</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

// Main export component with Suspense wrapper
export default function MoviesPage() {
	return (
		<Suspense fallback={<LoadingSkeleton />}>
			<MoviesPageContent />
		</Suspense>
	);
}
