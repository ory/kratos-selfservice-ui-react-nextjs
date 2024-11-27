# Use the official Node.js 18 Alpine image as the base
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Start a new stage for the production image
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Set Node.js environment variable
ENV NODE_ENV=production
ENV ORY_SDK_URL=${KRATOS_SERVICE_URL}

# Copy the built application from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# The port the app runs on (EXPOSE is just for documentation)
EXPOSE 3000

# Start the Next.js application
CMD ["node", "server.js"] 