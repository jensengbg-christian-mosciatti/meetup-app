 FROM node:lts-alpine

 WORKDIR /app

#  ENV PORT 80

COPY package.json /app/package.json

RUN npm install

CMD [ "node", "server.js" ]