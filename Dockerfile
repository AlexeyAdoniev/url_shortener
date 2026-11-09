FROM node:24-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile --ignore-engines

COPY . ./
RUN yarn build

FROM node:24-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN corepack enable \
  && yarn install --frozen-lockfile --production=true --ignore-engines \
  && yarn cache clean

COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000

CMD ["node", "dist/main.js"]
