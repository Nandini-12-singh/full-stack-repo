# 🎬 CineVerse

A beautiful and modern movie search application built with Next.js, TypeScript, and the OMDB API. This app allows users to search for movies, view detailed information, and rate their favorites.

## ✨ Features

### Core Functionality

- **Movie Search**: Search for movies by title with auto-complete and debounced API calls
- **Actor Search**: Search for actors by name and discover their filmography
- **Movie Details**: View detailed information including plot, cast, ratings, and more
- **Actor Details**: View actor information including biography, filmography, and genres
- **User Ratings**: Rate movies with a 5-star rating system (stored locally)
- **Dark Mode**: Toggle between light and dark themes with persistence
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Pages

- **`/movies`** - Movie list page with search functionality
- **`/movies/[id]`** - Individual movie details page
- **`/actors`** - Actor search and discovery page
- **`/actors/[name]`** - Individual actor details page

### UI/UX Features

- Modern and clean design inspired by popular movie platforms
- Smooth animations and transitions using Framer Motion
- Loading states and error handling
- Skeleton loading for better UX
- Beautiful gradient backgrounds and cards

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Components**: Custom UI components with shadcn/ui patterns
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **API**: OMDB API for movie data

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd movie-search
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

### Searching for Movies

1. Navigate to the Movies page
2. Use the search bar to enter a movie title
3. Results will appear automatically as you type (debounced)
4. Click on any movie card to view detailed information

### Searching for Actors

1. Navigate to the Actors page or use the search bar with "Actors Only" filter
2. Search for actors by name or browse popular actors
3. Click on any actor card to view their filmography
4. Discover movies featuring your favorite actors

### Rating Movies

1. Go to a movie's detail page
2. Click on the stars to rate the movie (1-5 stars)
3. Your rating will be saved locally and persist across sessions

### Dark Mode

- Use the toggle button in the header to switch between light and dark modes
- Your preference will be saved and applied on future visits

## 🎯 Key Features Implemented

### ✅ Required Features

- [x] Movie search with OMDB API integration
- [x] Actor search with comprehensive actor database
- [x] Movie listing page (`/movies`)
- [x] Movie details page (`/movies/:id`)
- [x] Actor listing page (`/actors`)
- [x] Actor details page (`/actors/:name`)
- [x] Debounced search functionality
- [x] Star rating system with local storage
- [x] Dark mode toggle with persistence
- [x] Responsive design
- [x] TypeScript implementation
- [x] Redux Toolkit for state management
- [x] Framer Motion animations
- [x] Advanced loading and error states
- [x] Beautiful modern UI design
- [x] Proper image handling with fallbacks
- [x] SEO-friendly structure

## 🔧 API Configuration

The app uses the OMDB API with the provided API key

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── movies/            # Movies pages
│   │   ├── [id]/         # Dynamic movie detail pages
│   │   └── page.tsx      # Movies listing page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page (redirects to /movies)
│   └── providers.tsx     # Redux and theme providers
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── DarkModeToggle.tsx
│   ├── Header.tsx
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   └── SearchBar.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # API services
├── store/                # Redux store and slices
└── types/                # TypeScript type definitions
```

## 🎨 Design Decisions

### State Management

- **Redux Toolkit** for global state management
- Local storage for user preferences (ratings, dark mode)
- Debounced search to optimize API calls

### UI/UX

- Clean, modern design with consistent spacing and typography
- Card-based layout for movie listings
- Smooth transitions and hover effects
- Proper loading states and error handling
- Accessible color contrasts in both light and dark modes

### Performance

- Image optimization with Next.js Image component
- Debounced search to reduce API calls
- Lazy loading and code splitting
- Efficient re-renders with proper React patterns

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔐 Environment Variables

To enable the Gemini-powered multilingual chatbot, set the following environment variable in your environment (e.g., `.env.local`):

```
GOOGLE_API_KEY=your_google_generative_ai_key
```

You can obtain an API key by creating a project and enabling the Generative Language API in Google AI Studio.

## 💬 Multilingual Chatbot

- Appears site-wide as a floating button in the bottom-right corner
- Supports auto language detection or manual selection
- Helps with movie/actor search, recommendations, and app feature guidance
- Backend route: `src/app/api/chat/route.ts` using `@google/generative-ai`

## 🌟 Future Enhancements

- Add user authentication
- Implement watchlist functionality
- Add movie recommendations
- Include trailers and additional media
- Add advanced filtering options
- Implement movie comparison features
- Expand actor database with more performers
- Add actor awards and accolades information
- Implement actor collaboration networks

## 📄 License

This project is licensed under the [MIT License](LICENSE).


---

Built with ❤️ using Next.js and the OMDB API

---

## ⚙️ CI/CD Pipeline

This project uses **GitHub Actions** for automated Continuous Integration and Deployment.

### How it works

```
Push / PR to main
       │
       ▼
┌─────────────────────────────────┐
│  CI Workflow  (ci.yml)          │
│  1. Install dependencies        │
│  2. ESLint lint check           │
│  3. TypeScript type-check       │
│  4. Next.js production build    │
│  5. Docker image smoke test     │
└────────────────┬────────────────┘
                 │ on success (push to main only)
                 ▼
┌─────────────────────────────────┐
│  Deploy Workflow  (deploy.yml)  │
│  1. Vercel production deploy    │
│  2. (Optional) Push to GHCR    │
└─────────────────────────────────┘
```

### Workflows

| File | Trigger | Purpose |
|------|---------|---------|
| `.github/workflows/ci.yml` | Push & PR to `main` | Lint → Type-check → Build → Docker smoke test |
| `.github/workflows/deploy.yml` | CI passes on `main` / manual | Deploy to Vercel production |

### Required GitHub Secrets

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret name | Where to get it | Required for |
|---|---|---|
| `NEXT_PUBLIC_OMDB_API_KEY` | [OMDb API](https://www.omdbapi.com/apikey.aspx) | CI build + runtime |
| `NEXT_PUBLIC_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) | CI build + runtime |
| `VERCEL_TOKEN` | Vercel → Settings → Tokens | Deployment |
| `VERCEL_ORG_ID` | Run `vercel link` locally, check `.vercel/project.json` | Deployment |
| `VERCEL_PROJECT_ID` | Run `vercel link` locally, check `.vercel/project.json` | Deployment |

> **Never commit real API keys.** The `.env.local` file is git-ignored. All secrets are injected at build/runtime via GitHub Actions secrets.

### Optional Repository Variable

| Variable name | Value | Purpose |
|---|---|---|
| `ENABLE_DOCKER_PUSH` | `true` | Enables pushing Docker image to GitHub Container Registry (GHCR) |

Set this under **Settings → Secrets and variables → Actions → Variables**.

### How to get Vercel credentials

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link your project (run once from the project root)
vercel link

# 3. Get your IDs
cat .vercel/project.json
# → { "orgId": "...", "projectId": "..." }

# 4. Get your token
# Vercel dashboard → Settings → Tokens → Create
```

### How deployment happens

1. You push code to `main`
2. CI workflow runs — lint, type-check, build, Docker smoke test
3. If CI passes, the deploy workflow automatically triggers
4. Vercel CLI pulls project settings, builds, and deploys to production
5. The live URL is printed in the Actions logs

You can also trigger a manual deployment from the **Actions** tab → **Deploy — Vercel Production** → **Run workflow**.

### Running the pipeline locally (act)

You can simulate GitHub Actions locally using [`act`](https://github.com/nektos/act):

```bash
# Install act (Windows: choco install act-cli)
# Run the CI workflow
act push --job build
```

---
#   f u l l - s t a c k - r e p o  
 