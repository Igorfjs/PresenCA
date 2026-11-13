FROM node:22-alpine AS dependencies
WORKDIR /workspace
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install

FROM dependencies AS development
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run", "start:dev"]

FROM dependencies AS builder
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /workspace
RUN apk add --no-cache openssl
COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/dist ./dist
COPY --from=builder /workspace/prisma ./prisma
COPY --from=builder /workspace/package.json ./package.json
RUN npm prune --omit=dev
EXPOSE 4000
CMD ["node", "dist/main.js"]
