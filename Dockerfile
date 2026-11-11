FROM node:24-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile --ignore-engines

COPY . ./
RUN yarn nx run api:build \
  && yarn nx run generator:build

FROM node:24-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN corepack enable \
  && yarn install --frozen-lockfile --production=true --ignore-engines \
  && yarn cache clean

COPY --from=build /app/dist/apps/api ./dist/apps/api
COPY --from=build /app/dist/apps/generator ./dist/apps/generator

USER node
EXPOSE 3000
EXPOSE 3001

CMD ["node", "dist/apps/api/main.js"]
