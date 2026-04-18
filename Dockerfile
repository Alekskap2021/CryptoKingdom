FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM base AS build
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json
RUN mkdir -p data exports && chown -R appuser:nodejs data exports
USER appuser
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
