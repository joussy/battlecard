ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS client-builder

WORKDIR /usr/src/app

COPY client/ client

# Install dependencies and build the frontend application.
WORKDIR /usr/src/app/client

RUN npm ci

ENV NODE_ENV production

RUN npm run build

#########
FROM node:${NODE_VERSION}-alpine

# Install dependencies and build the backend application.
WORKDIR /usr/src
COPY server/ app


RUN npm ci
RUN npm run build

COPY --from=client-builder /usr/src/app/client/dist /usr/src/app/dist/public

# Print all files for debugging purposes.
RUN find . -type d \( -name node_modules -o -name .git \) -prune -o -type f -print

ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD node /usr/src/app/dist/main
