FROM node:22.15.1-alpine

WORKDIR /app/api

COPY api/package.json api/yarn.lock ./

RUN yarn install

COPY api ./
COPY public /app/public

CMD [ "yarn", "start" ]