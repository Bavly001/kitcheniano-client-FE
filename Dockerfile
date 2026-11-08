# ==============================================================================
# KITCHENIANO CLIENT FRONTEND (Next.js 14 App Router) - STANDALONE DOCKERFILE
# ==============================================================================
# Runs on port 3001 as the customer storefront for online ordering and tracking.
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1: DEPENDENCIES CACHE
# ------------------------------------------------------------------------------
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Clean install dependencies
RUN npm ci

# ------------------------------------------------------------------------------
# STAGE 2: BUILDER
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/public

ARG NEXT_PUBLIC_API_URL=http://localhost:4001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js standalone application
RUN npm run build

# ------------------------------------------------------------------------------
# STAGE 3: RUNNER (Production Runtime)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

USER node

COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE 3001

CMD ["node", "server.js"]
