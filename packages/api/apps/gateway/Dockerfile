FROM node:22.15.1-alpine AS builder

WORKDIR /app

# Root
COPY package.json yarn.lock ./

# Gateway
COPY apps/gateway/package.json ./apps/gateway/package.json
COPY apps/gateway/nest-cli.json ./apps/gateway/nest-cli.json
COPY apps/gateway/tsconfig*.json ./apps/gateway/

COPY apps/gateway ./apps/gateway
COPY libs ./libs

RUN yarn install --frozen-lockfile
RUN yarn workspace proto build
RUN yarn workspace gateway build

FROM node:22.15.1-alpine AS runner

WORKDIR /app

# packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/gateway/package.json ./apps/gateway/package.json

# deps/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "yarn", "workspace", "gateway", "start:prod" ]