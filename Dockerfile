############################################################
# Build arguments
############################################################
ARG NODE_VERSION=22

############################################################
# Stage 1: Build frontend (client)
############################################################
FROM node:${NODE_VERSION}-alpine AS client-builder

# Copy client source code
COPY client/ /app/client
# Copy shared types for client usage
COPY server/src/shared/ /app/server/src/shared

# Set working directory for client build
WORKDIR /app/client

# Install dependencies and build the frontend
RUN npm ci
ENV NODE_ENV production
RUN npm run build

############################################################
# Stage 2: Build backend (server)
############################################################
FROM node:${NODE_VERSION}-alpine AS server-builder

# Set working directory for server build
WORKDIR /app
# Copy only package.json and lock for dependency caching
COPY server/package*.json ./
# Install backend dependencies
RUN npm ci
# Copy backend source code
COPY server/ ./
# Build backend
RUN npm run build
# Remove source and test files after build to reduce image size
RUN rm -R /app/src /app/test

# Copy built frontend into backend public folder
COPY --from=client-builder /app/client/dist /app/public

############################################################
# Final image setup
############################################################
# Print all files for debugging purposes (optional)
RUN find /app -type d \( -name node_modules -o -name .git \) -prune -o -type f -print

# Set environment for production
ENV NODE_ENV production
# Set working directory for runtime
WORKDIR /app
# Expose application port
EXPOSE 3000
# Healthcheck for container
HEALTHCHECK --interval=30s --timeout=5s CMD wget --spider -q http://localhost:3000 || exit 1
# Run as non-root user for security
USER node
# Start the backend application
CMD node /app/dist/main
