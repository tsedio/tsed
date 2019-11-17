###############################################################################
###############################################################################
##                      _______ _____ ______ _____                           ##
##                     |__   __/ ____|  ____|  __ \                          ##
##                        | | | (___ | |__  | |  | |                         ##
##                        | |  \___ \|  __| | |  | |                         ##
##                        | |  ____) | |____| |__| |                         ##
##                        |_| |_____/|______|_____/                          ##
##                                                                           ##
## description     : Dockerfile for TsED Application                         ##
## author          : TsED team                                               ##
## date            : 20190820                                                ##
## version         : 1.0                                                     ##
###############################################################################
###############################################################################
FROM node:12.13.0-alpine

RUN apk update && npm install -g yarn@1.15.2

COPY package.json .
COPY yarn.lock .
COPY lerna.json .

RUN apk update && apk add build-base git python

COPY package.json .
COPY yarn.lock .
COPY processes.config.js .
COPY ./packages/client/dist ./packages/client/dist
COPY ./packages/server ./packages/server

EXPOSE 8081
ENV PORT 8081
ENV NODE_ENV production

RUN yarn install --production --frozen-lockfile --ignore-scripts && yarn bootstrap:production

CMD ["yarn", "start:prod"]
