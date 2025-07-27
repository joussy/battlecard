ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS client-builder

COPY client/ /app/client
COPY server/src/shared/ /app/server/src/shared

RUN find /app -type d \( -name node_modules -o -name .git \) -prune -o -type f -print

# Install dependencies and build the frontend application.
WORKDIR /app/client

RUN npm ci

ENV NODE_ENV production

RUN npm run build

#########
FROM node:${NODE_VERSION}-alpine AS server-builder

# Install dependencies and build the backend application.
COPY server/ /app


RUN find /app -type d \( -name node_modules -o -name .git \) -prune -o -type f -print

WORKDIR /app

RUN npm ci
RUN npm run build
RUN rm -R /app/src /app/test

COPY --from=client-builder /app/client/dist /app/dist/public

# Print all files for debugging purposes.
RUN find /app -type d \( -name node_modules -o -name .git \) -prune -o -type f -print

ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD node /app/dist/main
