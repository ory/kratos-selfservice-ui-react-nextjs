FROM node:14-alpine AS build-env

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

# Building app
COPY package*.json ./

# Install node modules
# Note: We also install dev deps as TypeScript may be needed
RUN npm install

# Copy files. Use dockerignore to avoid copying node_modules
COPY . .

# Build
RUN npm run build

# Running the app
FROM gcr.io/distroless/nodejs:14 AS runner
WORKDIR /app

# Mark as prod, disable telemetry, set port
ENV NODE_ENV production
ENV PORT 8080
ENV NEXT_TELEMETRY_DISABLED 1

# Copy from build
COPY --from=build-env /app/next.config.js ./
COPY --from=build-env /app/public ./public
COPY --from=build-env /app/.next ./.next
COPY --from=build-env /app/node_modules ./node_modules

# Run app command
CMD ["./node_modules/next/dist/bin/next", "start"]