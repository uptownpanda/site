FROM node:fermium-alpine

RUN mkdir /app
WORKDIR /app

COPY ./src /app
RUN npm install
RUN npm build

CMD ["npm", "run", "start"]