 FROM node:lts-alpine

 WORKDIR /app

#  ENV PORT 80

COPY package.json /app/package.json

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "./server/server.js" ]