FROM node:22.15.1-alpine AS builder

WORKDIR /app

# Root
COPY package.json yarn.lock ./

# Subscription
COPY apps/subscription/package.json ./apps/subscription/package.json
COPY apps/subscription/nest-cli.json ./apps/subscription/nest-cli.json
COPY apps/subscription/tsconfig*.json ./apps/subscription/

COPY apps/subscription ./apps/subscription
COPY libs ./libs

RUN yarn install --frozen-lockfile
RUN yarn workspace subscription build

FROM node:22.15.1-alpine AS runner

WORKDIR /app

# packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/subscription/package.json ./apps/subscription/package.json

# deps/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3002

CMD [ "yarn", "workspace", "subscription", "start:prod" ]