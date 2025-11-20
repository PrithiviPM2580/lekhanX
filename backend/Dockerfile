# Use official lightweight Node.js image
FROM node:20-alpine3.20

# Set working directory inside container
WORKDIR /app

# Enable Corepack so pnpm/yarn become available
RUN corepack enable

# Copy dependency files first for caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy all remaining project files
COPY . .

# Build TypeScript to JavaScript
RUN pnpm run build

# Expose the app port (for documentation only)
EXPOSE 3000

# Start the application using pnpm
CMD ["pnpm", "start"]
