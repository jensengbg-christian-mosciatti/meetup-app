 FROM node:lts-alpine

 WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "./server/server.js" ]