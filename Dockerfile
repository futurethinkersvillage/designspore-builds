FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build
# Runtime admin hide/show overrides land here; mount a persistent volume at
# this path in Coolify so the choices survive redeploys.
RUN mkdir -p /app/.data
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
