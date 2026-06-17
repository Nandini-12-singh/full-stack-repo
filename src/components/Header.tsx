"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
	Film,
	Search,
	Menu,
	User,
	Home,
	Tv,
	Grid,
	X,
	Bookmark,
	Heart,
} from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface HeaderProps {
	onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);
	const watchlistMovies = useSelector(
		(state: RootState) => state.watchlist.movies
	);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	const navLinks = [
		{ name: "Movies",    path: "/movies",    icon: Home     },
		{ name: "TV Shows",  path: "/tv-shows",  icon: Tv       },
		{ name: "Actors",    path: "/actors",    icon: User     },
		{ name: "Genres",    path: "/genres",    icon: Grid     },
		{ name: "Watchlist", path: "/watchlist", icon: Bookmark,
		  badge: isHydrated && watchlistMovies.length > 0 ? watchlistMovies.length : null },
	];

	return (
		<>
			{/* ── Main header bar ───────────────────────────────────── */}
			<motion.header
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="fixed top-0 left-0 right-0 z-50
				           bg-white/90 dark:bg-[#3d1c2e]/90
				           backdrop-blur-2xl
				           border-b border-pink-200/60 dark:border-pink-900/40
				           transition-all duration-300">

				{/* Subtle pink tint overlay */}
				<div className="absolute inset-0 bg-gradient-to-r
				                from-pink-50/60 via-white/40 to-rose-50/60
				                dark:from-pink-950/30 dark:via-transparent dark:to-rose-950/30
				                pointer-events-none" />

				<div className="relative container mx-auto
				                px-3 sm:px-4 md:px-6
				                h-14 sm:h-16 md:h-20
				                flex items-center justify-between">

					{/* ── Logo ───────────────────────────────────────── */}
					<Link
						href="/movies"
						className="flex items-center gap-2 md:gap-3
						           hover:scale-105 transition-transform duration-300
						           group flex-shrink-0">
						<div className="relative">
							{/* Glow ring */}
							<div className="absolute -inset-1 bg-gradient-to-br
							                from-pink-300 via-rose-300 to-pink-400
							                rounded-xl blur-md opacity-30
							                group-hover:opacity-60 transition-opacity duration-300" />
							{/* Icon box */}
							<div className="relative bg-gradient-to-br
							                from-pink-400 via-rose-400 to-pink-500
							                p-2 md:p-2.5 rounded-xl
							                shadow-lg shadow-pink-200/60
							                border border-pink-300/40">
								<motion.div
									whileHover={{ rotate: 360 }}
									transition={{ duration: 0.7, ease: "easeOut" }}>
									<Film className="h-4 w-4 md:h-5 md:w-5 text-white drop-shadow" />
								</motion.div>
							</div>
						</div>

						<div className="flex flex-col">
							<span className="text-base sm:text-xl md:text-2xl font-black
							                 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600
							                 dark:from-pink-300 dark:via-rose-300 dark:to-pink-400
							                 bg-clip-text text-transparent tracking-tight">
								CineVerse
							</span>
							<span className="hidden sm:block text-[10px] font-semibold
							                 tracking-widest uppercase
							                 text-pink-400 dark:text-pink-400 -mt-0.5">
								✦ Discover &amp; Explore
							</span>
						</div>
					</Link>

					{/* ── Desktop nav ────────────────────────────────── */}
					<nav className="hidden md:flex items-center gap-1 ml-6 lg:ml-10">
						{navLinks.map(({ name, path, icon: Icon, badge }) => {
							const isActive = pathname === path;
							return (
								<Link
									key={path}
									href={path}
									className={`relative group px-4 py-2 rounded-xl font-semibold text-sm
									            transition-all duration-200
									            ${isActive
									              ? "text-pink-600 dark:text-pink-300"
									              : "text-gray-600 dark:text-pink-200/70 hover:text-pink-600 dark:hover:text-pink-300"
									            }`}>
									{/* Active / hover bg pill */}
									<div className={`absolute inset-0 rounded-xl transition-all duration-200
									                 bg-gradient-to-r from-pink-100 to-rose-100
									                 dark:from-pink-900/40 dark:to-rose-900/40
									                 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
									<span className="relative flex items-center gap-1.5">
										<Icon className="w-3.5 h-3.5" />
										{name}
										{badge && (
											<span className="bg-gradient-to-r from-pink-500 to-rose-500
											                 text-white text-[10px] px-1.5 py-0.5
											                 rounded-full font-bold leading-none">
												{badge}
											</span>
										)}
									</span>
									{/* Active underline */}
									<div className={`absolute -bottom-px left-3 right-3 h-0.5
									                 bg-gradient-to-r from-pink-400 to-rose-400
									                 rounded-full transition-transform duration-200
									                 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
								</Link>
							);
						})}
					</nav>

					{/* ── Right actions ──────────────────────────────── */}
					<div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

						{/* Search */}
						<motion.button
							onClick={onSearchClick}
							whileHover={{ scale: 1.08 }}
							whileTap={{ scale: 0.93 }}
							className="p-2 rounded-xl text-pink-400 hover:text-pink-600
							           hover:bg-pink-50 dark:hover:bg-pink-900/30
							           border border-transparent hover:border-pink-200 dark:hover:border-pink-800
							           transition-all duration-200 touch-target">
							<Search className="h-4 w-4" />
						</motion.button>

						{/* Watchlist icon */}
						<Link href="/watchlist">
							<motion.button
								whileHover={{ scale: 1.08 }}
								whileTap={{ scale: 0.93 }}
								className="relative p-2 rounded-xl text-pink-400 hover:text-pink-600
								           hover:bg-pink-50 dark:hover:bg-pink-900/30
								           border border-transparent hover:border-pink-200 dark:hover:border-pink-800
								           transition-all duration-200 touch-target">
								<Bookmark className="h-4 w-4" />
								{isHydrated && watchlistMovies.length > 0 && (
									<span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5
									                 bg-gradient-to-br from-pink-500 to-rose-500
									                 rounded-full border-2 border-white dark:border-[#3d1c2e]
									                 animate-pulse" />
								)}
							</motion.button>
						</Link>

						{/* Dark mode toggle */}
						<div className="p-0.5 rounded-xl border border-pink-200/60 dark:border-pink-800/40">
							<DarkModeToggle />
						</div>

						{/* Profile */}
						<Link href="/profile" className="hidden sm:block">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-2 px-3 py-1.5
								           bg-gradient-to-r from-pink-50 to-rose-50
								           dark:from-pink-900/30 dark:to-rose-900/30
								           border border-pink-200/70 dark:border-pink-800/50
								           rounded-xl transition-all duration-200
								           hover:shadow-md hover:shadow-pink-100 dark:hover:shadow-pink-900/20">
								<div className="relative w-6 h-6 md:w-7 md:h-7
								                bg-gradient-to-br from-pink-400 to-rose-500
								                rounded-lg flex items-center justify-center">
									<User className="h-3.5 w-3.5 text-white" />
									<div className="absolute -bottom-0.5 -right-0.5
									                w-2 h-2 bg-emerald-400
									                border-2 border-white dark:border-[#3d1c2e]
									                rounded-full" />
								</div>
								<span className="hidden md:block text-sm font-semibold
								                 text-pink-600 dark:text-pink-300">
									Profile
								</span>
							</motion.button>
						</Link>

						{/* Hamburger */}
						<motion.button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							whileHover={{ scale: 1.08 }}
							whileTap={{ scale: 0.93 }}
							aria-label="Toggle menu"
							className="md:hidden p-2 rounded-xl
							           text-pink-500 hover:text-pink-700
							           hover:bg-pink-50 dark:hover:bg-pink-900/30
							           border border-transparent hover:border-pink-200 dark:hover:border-pink-800
							           transition-all duration-200 touch-target">
							<motion.div animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
							            transition={{ duration: 0.25 }}>
								{isMobileMenuOpen
									? <X className="h-5 w-5" />
									: <Menu className="h-5 w-5" />
								}
							</motion.div>
						</motion.button>
					</div>
				</div>

				{/* Bottom accent line */}
				<div className="absolute bottom-0 left-0 right-0 h-px
				                bg-gradient-to-r from-transparent via-pink-300/70 to-transparent" />
			</motion.header>

			{/* ── Mobile dropdown ───────────────────────────────────── */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -12, scale: 0.97 }}
						animate={{ opacity: 1, y: 0,   scale: 1     }}
						exit={{    opacity: 0, y: -12, scale: 0.97  }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="fixed top-14 sm:top-16 left-0 right-0 z-40 md:hidden px-3 pt-2">
						<div className="bg-white/97 dark:bg-[#3d1c2e]/97
						                backdrop-blur-2xl
						                border border-pink-200/60 dark:border-pink-800/40
						                rounded-2xl shadow-xl shadow-pink-100/50
						                overflow-hidden">

							{/* Nav links */}
							<div className="p-3 space-y-1">
								{navLinks.map(({ name, path, icon: Icon, badge }, i) => {
									const isActive = pathname === path;
									return (
										<motion.div
											key={path}
											initial={{ opacity: 0, x: -16 }}
											animate={{ opacity: 1, x: 0   }}
											transition={{ delay: i * 0.06, duration: 0.25 }}>
											<Link
												href={path}
												onClick={() => setIsMobileMenuOpen(false)}
												className={`flex items-center gap-3 px-4 py-3
												            rounded-xl font-semibold text-sm
												            transition-all duration-200 touch-target
												            ${isActive
												              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200/50"
												              : "text-gray-600 dark:text-pink-200/80 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-300"
												            }`}>
												<Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-pink-400"}`} />
												{name}
												{badge && (
													<span className="ml-auto bg-white/30 text-white
													                 text-[10px] px-2 py-0.5
													                 rounded-full font-bold">
														{badge}
													</span>
												)}
											</Link>
										</motion.div>
									);
								})}
							</div>

							{/* Footer row */}
							<div className="px-4 py-3 border-t border-pink-100 dark:border-pink-900/40
							                flex items-center justify-between">
								<div className="flex items-center gap-1.5 text-pink-400 text-xs font-semibold">
									<Heart className="w-3.5 h-3.5 fill-pink-400" />
									<span>CineVerse</span>
								</div>
								<Link
									href="/profile"
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center gap-2 px-3 py-1.5
									           bg-pink-50 dark:bg-pink-900/30
									           border border-pink-200/60 dark:border-pink-800/40
									           rounded-xl text-sm font-semibold
									           text-pink-600 dark:text-pink-300
									           touch-target">
									<User className="w-4 h-4" />
									Profile
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Header;
