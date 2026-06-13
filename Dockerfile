# =========================
# Base image
# =========================
FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# =========================
# Install dependencies
# =========================
FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable && pnpm install --frozen-lockfile

# =========================
# Build project
# =========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

# Copy toàn bộ source, bao gồm cả .env ở root
COPY . .

RUN corepack enable && pnpm build

# =========================
# Production runner
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy env từ root sang container runtime
COPY --from=builder /app/.env ./.env

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]