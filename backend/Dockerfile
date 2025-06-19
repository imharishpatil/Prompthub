# For Build
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./ 
RUN npm install

COPY . .

RUN npx ts-node src/index.ts

# For Production
# FROM node:20-alpine

# WORKDIR /app

# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/package-lock.json* ./
# COPY --from=builder /app/node_modules .node_modules
# COPY --from=builder /app/dist .dist
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/.env ./

# RUN npx prisma generate

# EXPOSE 4000

# CMD ["node", "dist/index.js"]