# Stage 1: Build
FROM node:22-alpine AS builder

# Install build tools and Python
RUN apk add --no-cache \
  build-base \
  python3 \
  libc6-compat

WORKDIR /app

ENV HUSKY=0

# Copy monorepo dependencies
COPY package.json yarn.lock tsconfig.json ./
COPY packages/runner ./packages/runner
COPY packages/core ./packages/core
RUN yarn
RUN yarn workspace @docker-watch/runner run build
RUN ls -la
RUN ls -la packages/runner

# Stage 2: Production Image
FROM node:22-alpine
WORKDIR /app

# Copy only necessary files from build stage
COPY --from=builder /app/packages/runner/lib ./packages/runner/lib
COPY --from=builder /app/packages/runner/package.json ./packages/runner/package.json
COPY --from=builder /app/packages/core/lib ./packages/core/lib
COPY --from=builder /app/packages/core/package.json ./packages/core/package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "packages/runner/lib/index.js"]
