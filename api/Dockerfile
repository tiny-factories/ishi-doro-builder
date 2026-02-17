FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./
RUN npm install --production

COPY src/ ./src/

RUN node src/seed.js

EXPOSE 4000

CMD ["node", "src/index.js"]
