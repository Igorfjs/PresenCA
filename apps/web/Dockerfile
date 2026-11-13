FROM node:22-alpine AS dependencies
WORKDIR /workspace
COPY package*.json ./
RUN npm ci

FROM dependencies AS development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

FROM dependencies AS builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY . .
RUN npm run build

FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /workspace
COPY --from=builder /workspace/.next/standalone ./
COPY --from=builder /workspace/.next/static ./.next/static
COPY --from=builder /workspace/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
