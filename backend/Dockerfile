FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["sh", "-c", "npx prisma db push && npx ts-node src/seed/seed.ts && npm start"]
EXPOSE 3001
