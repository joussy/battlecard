ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS client-builder

WORKDIR /usr/src/app

COPY client/ ./

RUN npm ci

ENV NODE_ENV production

RUN npm run build

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY server/ .

COPY --from=client-builder /usr/src/app/dist ./src/public

RUN npm ci --omit=dev

ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD node dist/main