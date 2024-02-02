FROM node:20-alpine as builder

WORKDIR /app

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install 

COPY ./ ./

RUN npm run build

FROM node:20-alpine 

WORKDIR /app

COPY ./package.json ./

COPY ./package-lock.json ./

COPY --from=builder /app/dist/ ./ 

RUN npm install

EXPOSE 8000

CMD ["npm", "run", "prod"]



