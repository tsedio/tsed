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

RUN apk update && apk add build-base git python

COPY package.json .
COPY yarn.lock .
COPY ./src ./src
COPY ./dist ./dist

RUN yarn install --production

EXPOSE 8083
ENV PORT 8083
ENV NODE_ENV production

CMD ["yarn", "start:prod"]
