FROM node:15.4 as builder

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:15.4-alpine
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
CMD npm run start:prod
