FROM node:20-alpine AS base
WORKDIR /app
COPY package.json tsconfig.json .eslintrc.json ./
RUN npm install --production=false
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY --from=base /app/dist ./dist
CMD ["node", "dist/index.js"]
