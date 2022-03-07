FROM node:16.14.0-alpine
WORKDIR /usr/src/app
COPY ./code/package*.json ./
RUN yarn install
RUN yarn global add @nestjs/cli
COPY ./code .
EXPOSE 8080
CMD ["yarn", "run", "start:dev"]