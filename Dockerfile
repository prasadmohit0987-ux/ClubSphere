FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG GIT_SHA=local

ENV GIT_SHA=$GIT_SHA

ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]