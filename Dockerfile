ARG NODE_VERSION=14.20.0
ARG YARN_VERSION=1.22.15

FROM node:${NODE_VERSION}-alpine as builder
WORKDIR /src

RUN npm config set unsafe-perm true
RUN apk update && apk add bash curl git

RUN npm install -g --force yarn@${YARN_VERSION}

COPY .git ./.git/
COPY scripts ./scripts/
COPY test ./test/
COPY packages ./packages/
COPY tools ./tools/
COPY package.json lerna.json yarn.lock tsconfig.base.json tsconfig.compile.json tsconfig.json ./

RUN yarn install --frozen-lockfile --ignore-scripts

CMD yarn lerna run start:express --scope @tsed/platform-express --stream
