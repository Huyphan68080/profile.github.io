# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
ARG VITE_DISCORD_USER_ID=""
ENV VITE_DISCORD_USER_ID=$VITE_DISCORD_USER_ID
RUN npm run build

FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist ./

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
