FROM node:18.18.0-alpine

WORKDIR /src/app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "run", "start:prod"]