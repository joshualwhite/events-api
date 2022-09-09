FROM node:12-alpine

WORKDIR /usr/src/app

ENV AWS_ACCESS_KEY_ID=id
ENV AWS_SECRET_ACCESS_KEY=key
ENV AWS_REGION=local
ENV AWS_ENDPOINT=http://dynamodb:8000

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]

EXPOSE 3000