# ---------- build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# ---------- runtime stage ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/build ./
COPY --from=builder /app/prisma ./prisma

RUN npm ci --omit=dev

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]