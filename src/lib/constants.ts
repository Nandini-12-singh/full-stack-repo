// Shared application constants

export const MOVIE_GENRES = [
  { value: "all", label: "All Genres" },
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Animation", label: "Animation" },
  { value: "Biography", label: "Biography" },
  { value: "Comedy", label: "Comedy" },
  { value: "Crime", label: "Crime" },
  { value: "Documentary", label: "Documentary" },
  { value: "Drama", label: "Drama" },
  { value: "Family", label: "Family" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "History", label: "History" },
  { value: "Horror", label: "Horror" },
  { value: "Music", label: "Music" },
  { value: "Mystery", label: "Mystery" },
  { value: "Romance", label: "Romance" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Sport", label: "Sport" },
  { value: "Thriller", label: "Thriller" },
  { value: "War", label: "War" },
  { value: "Western", label: "Western" },
] as const;

// Genre list without "all" option (for display-only contexts like the genres page)
export const BROWSABLE_GENRES = MOVIE_GENRES.filter((g) => g.value !== "all");
