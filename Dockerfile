ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS client-builder

COPY client/ /app/client
COPY server/src/shared/ /app/server/src/shared

# Install dependencies and build the frontend application.
WORKDIR /app/client

RUN npm ci
ENV NODE_ENV production
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS server-builder

# Install dependencies and build the backend application.
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --production
COPY server/ ./
RUN npm run build
RUN rm -R /app/src /app/test

COPY --from=client-builder /app/client/dist /app/public

# Print all files for debugging purposes.
RUN find /app -type d \( -name node_modules -o -name .git \) -prune -o -type f -print

ENV NODE_ENV production
WORKDIR /app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget --spider -q http://localhost:3000 || exit 1
USER node
CMD node /app/dist/main
