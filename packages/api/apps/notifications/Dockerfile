FROM node:22.15.1-alpine AS builder

WORKDIR /app

# Root
COPY package.json yarn.lock ./

# Notifications
COPY apps/notifications/package.json ./apps/notifications/package.json
COPY apps/notifications/nest-cli.json ./apps/notifications/nest-cli.json
COPY apps/notifications/tsconfig*.json ./apps/notifications/

COPY apps/notifications ./apps/notifications
COPY libs ./libs

RUN yarn install --frozen-lockfile
RUN yarn workspace notifications build

FROM node:22.15.1-alpine AS runner

WORKDIR /app

# packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/notifications/package.json ./apps/notifications/package.json

# deps/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD [ "yarn", "workspace", "notifications", "start:prod" ]