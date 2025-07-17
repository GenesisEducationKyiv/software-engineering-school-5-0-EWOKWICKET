FROM node:22.15.1-alpine AS builder

WORKDIR /app

# Root
COPY package.json yarn.lock ./

# Weather
COPY apps/weather/package.json ./apps/weather/package.json
COPY apps/weather/nest-cli.json ./apps/weather/nest-cli.json
COPY apps/weather/tsconfig*.json ./apps/weather/

COPY apps/weather ./apps/weather
COPY libs ./libs

RUN yarn install --frozen-lockfile
RUN yarn workspace weather build

FROM node:22.15.1-alpine AS runner

WORKDIR /app

# packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/weather/package.json ./apps/weather/package.json

# deps/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3003

CMD [ "yarn", "workspace", "weather", "start:prod" ]