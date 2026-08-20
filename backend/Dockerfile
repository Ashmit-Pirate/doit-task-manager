# ---- Backend Dockerfile ----
# Uses a multi-stage build for a lean production image.

# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Stage 2: Production image
FROM node:22-alpine AS runner
WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER appuser

EXPOSE 5000

CMD ["node", "server.js"]
