ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS client-builder

WORKDIR /usr/src/app

COPY client/ client
COPY shared/ shared

WORKDIR /usr/src/app/client

RUN npm ci

ENV NODE_ENV production

RUN npm run build

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src

COPY server/ /usr/src/server
COPY shared/ /usr/src/shared

WORKDIR /usr/src/server

RUN npm ci
RUN npm run build

COPY --from=client-builder /usr/src/app/client/dist /usr/src/server/dist/server/public/

ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD node /usr/src/server/dist/server/src/main
