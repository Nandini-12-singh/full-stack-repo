"use client";

import { useState, useEffect } from "react";
import { Mail, Facebook, Instagram, Github, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	return (
		<footer className="bg-gradient-to-br from-pink-50 via-white to-rose-50
		                   dark:from-[#2d0f1e] dark:via-[#3d1c2e] dark:to-[#2d0f1e]
		                   border-t border-pink-200/60 dark:border-pink-900/40
		                   text-gray-500 dark:text-pink-300/70 pt-14 pb-8 mt-16">
			<div className="max-w-7xl mx-auto px-6
			                grid grid-cols-1 md:grid-cols-4 gap-10">

				{/* ── Brand ──────────────────────────────────────── */}
				<div>
					<h2 className="text-2xl font-black mb-3
					               bg-gradient-to-r from-pink-500 to-rose-500
					               bg-clip-text text-transparent">
						Cine<span className="text-rose-400">Verse</span>
					</h2>
					<p className="text-sm leading-relaxed text-gray-500 dark:text-pink-300/60">
						Discover millions of movies and TV shows. Track, rate, and share what you love.
					</p>

					{/* Social icons */}
					<div className="flex items-center gap-3 mt-5">
						{[
							{ href: "https://facebook.com",  label: "Facebook",
							  icon: <Facebook className="h-4 w-4" /> },
							{ href: "https://twitter.com",   label: "X / Twitter",
							  icon: (
								<svg viewBox="0 0 1200 1227" className="h-4 w-4 fill-current">
									<path d="M714.163 519.284L1160.89 0H1052.64L668.25 450.887L356.684 0H0L468.696 681.821L0 1226.48H108.253L512.75 741.896L843.316 1226.48H1200L714.137 519.284H714.163ZM567.171 678.249L518.802 609.828L147.253 79.694H305.124L605.286 500.884L653.655 569.305L1052.67 1150.31H894.796L567.171 678.275V678.249Z" />
								</svg>
							  )},
							{ href: "https://instagram.com", label: "Instagram",
							  icon: <Instagram className="h-4 w-4" /> },
							{ href: "https://github.com",    label: "GitHub",
							  icon: <Github className="h-4 w-4" /> },
						].map(({ href, label, icon }) => (
							<a
								key={label}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={label}
								className="p-2 rounded-xl
								           bg-pink-100/70 dark:bg-pink-900/30
								           text-pink-400 dark:text-pink-400
								           hover:bg-pink-200 dark:hover:bg-pink-800/50
								           hover:text-pink-600 dark:hover:text-pink-300
								           border border-pink-200/50 dark:border-pink-800/40
								           transition-all duration-200">
								{icon}
							</a>
						))}
					</div>
				</div>

				{/* ── Explore ────────────────────────────────────── */}
				<div>
					<h3 className="text-sm font-bold uppercase tracking-widest mb-4
					               text-pink-500 dark:text-pink-400">
						Explore
					</h3>
					<ul className="space-y-2.5 text-sm">
						{[
							{ href: "/movies",    label: "Movies"    },
							{ href: "/tv-shows",  label: "TV Shows"  },
							{ href: "/genres",    label: "Genres"    },
							{ href: "/actors",    label: "Actors"    },
							{ href: "/watchlist", label: "Watchlist" },
						].map(({ href, label }) => (
							<li key={href}>
								<Link
									href={href}
									className="hover:text-pink-500 dark:hover:text-pink-300
									           transition-colors duration-200">
									{label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* ── Support ────────────────────────────────────── */}
				<div>
					<h3 className="text-sm font-bold uppercase tracking-widest mb-4
					               text-pink-500 dark:text-pink-400">
						Support
					</h3>
					<ul className="space-y-2.5 text-sm">
						{[
							{ href: "/faq",     label: "FAQs"             },
							{ href: "/contact", label: "Contact Us"        },
							{ href: "/terms",   label: "Terms of Service"  },
							{ href: "/privacy", label: "Privacy Policy"    },
						].map(({ href, label }) => (
							<li key={href}>
								<a
									href={href}
									className="hover:text-pink-500 dark:hover:text-pink-300
									           transition-colors duration-200">
									{label}
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* ── Newsletter ─────────────────────────────────── */}
				<div>
					<h3 className="text-sm font-bold uppercase tracking-widest mb-4
					               text-pink-500 dark:text-pink-400 flex items-center gap-2">
						<Mail className="h-4 w-4" /> Stay Updated
					</h3>

					{isHydrated ? (
						<form className="flex flex-col gap-2">
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full bg-white dark:bg-pink-950/40
								           text-gray-700 dark:text-pink-100
								           placeholder-pink-300 dark:placeholder-pink-600
								           px-4 py-2.5 rounded-xl text-sm
								           border border-pink-200/70 dark:border-pink-800/50
								           focus:outline-none focus:ring-2
								           focus:ring-pink-300 dark:focus:ring-pink-700
								           transition-all duration-200"
							/>
							<button
								type="submit"
								className="w-full bg-gradient-to-r from-pink-400 to-rose-400
								           hover:from-pink-500 hover:to-rose-500
								           text-white px-4 py-2.5 rounded-xl
								           text-sm font-semibold
								           shadow-md shadow-pink-200/50
								           transition-all duration-200">
								Subscribe
							</button>
						</form>
					) : (
						/* SSR placeholder — same dimensions, no interactivity */
						<div className="flex flex-col gap-2">
							<div className="bg-white dark:bg-pink-950/40
							                border border-pink-200/70 dark:border-pink-800/50
							                text-pink-300 px-4 py-2.5 rounded-xl text-sm">
								Enter your email
							</div>
							<div className="bg-gradient-to-r from-pink-400 to-rose-400
							                text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
								Subscribe
							</div>
						</div>
					)}
				</div>
			</div>

			{/* ── Bottom bar ─────────────────────────────────────── */}
			<div className="max-w-7xl mx-auto px-6 mt-12
			                pt-6 border-t border-pink-200/50 dark:border-pink-900/40
			                flex flex-col sm:flex-row items-center justify-between gap-3">
				<p className="text-xs text-gray-400 dark:text-pink-500/60">
					© {new Date().getFullYear()} CineVerse. All rights reserved.
				</p>
				<p className="text-xs text-pink-400 dark:text-pink-500/60
				              flex items-center gap-1">
					Made with <Heart className="w-3 h-3 fill-pink-400 text-pink-400" /> for movie lovers
				</p>
			</div>
		</footer>
	);
}
