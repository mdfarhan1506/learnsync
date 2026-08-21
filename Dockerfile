# ==========================================
# LEARNsync Fullstack Unified Dockerfile
# Multi-stage production build (Frontend + Backend)
# ==========================================

# ------------------------------------------
# Stage 1: Build Frontend SPA
# ------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ------------------------------------------
# Stage 2: Build Backend Node/TypeScript App
# ------------------------------------------
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# ------------------------------------------
# Stage 3: Production Runtime
# ------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl ca-certificates

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL="file:./prisma/learnsync.db"
ENV JWT_SECRET="learnsync-prod-secret-change-me"

# Install production dependencies only
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy built Prisma client & engine
COPY --from=backend-builder /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=backend-builder /app/backend/node_modules/@prisma ./node_modules/@prisma

# Copy backend compiled code and prisma schema/migrations
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma

# Copy frontend static build for unified serving
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose API and Web application port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Automatically push database schema, run initial seed if required, and launch server
CMD ["sh", "-c", "npx prisma db push && npm start"]
