# For Build
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# Install OpenSSL 1.1 (required by Prisma)
RUN apt-get update && apt-get install -y openssl

COPY . .

# Build TypeScript
RUN npm run build

# Generate Prisma client (if using Prisma)
RUN npx prisma generate

# entrypoint script
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]



# For Production
# FROM node:20-slim

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