# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev=false   # install all deps (including devDeps needed for build)

# ── Stage 2: Build the Next.js application ────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Accept API keys as build-time arguments
# These are injected by the CI/CD pipeline — never hardcode values here
ARG NEXT_PUBLIC_OMDB_API_KEY
ARG NEXT_PUBLIC_GEMINI_API_KEY

# Expose them as environment variables so Next.js picks them up at build time
ENV NEXT_PUBLIC_OMDB_API_KEY=$NEXT_PUBLIC_OMDB_API_KEY
ENV NEXT_PUBLIC_GEMINI_API_KEY=$NEXT_PUBLIC_GEMINI_API_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── Stage 3: Production runtime ───────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy only what is needed to run the app
COPY --from=builder /app/public      ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
