# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copy monorepo dependencies
COPY package.json yarn.lock ./
COPY packages/runner ./packages/runner
RUN yarn install --immutable
RUN yarn workspace @docker-watch/runner run build

# Stage 2: Production Image
FROM node:22-alpine
WORKDIR /app

# Copy only necessary files from build stage
COPY --from=builder /app/packages/runner/lib ./lib
COPY --from=builder /app/packages/runner/package.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "lib/index.js"]
