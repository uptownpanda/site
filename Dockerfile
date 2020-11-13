FROM node:fermium-alpine AS build
WORKDIR /app
COPY ./src ./
RUN npm install
RUN npm run build

FROM node:fermium-alpine AS production
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "run", "start"]