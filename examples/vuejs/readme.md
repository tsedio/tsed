# Ts.ED - Vue.js

This project show you how you can create a project based on Ts.ED + Vue.js as client application.
This example can be used to create project based on other popular client frameworks like React or Angular.

See [Ts.ED](https://tsed.io) project for more information.

## Features

- Vue.js + Vue-cli
- Lerna && Yarn workspaces - monorepo manager
- PM2 - node process manager
- Docker and Docker compose
- Travis CI

[<img src="https://vuejs.org/images/logo.png" height="100" />](https://vuejs.org)
[<img src="https://cloud.githubusercontent.com/assets/952783/15271604/6da94f96-1a06-11e6-8b04-dc3171f79a90.png" height="100" />](https://lerna.js.org/)
[<img src="https://raw.githubusercontent.com/Unitech/pm2/development/pres/pm2-v4.png" height="80" />](https://pm2.keymetrics.io/)
[<img src="https://www.docker.com/sites/default/files/social/docker_facebook_share.png" height="100" />](https://docker.com)
[<img src="https://travis-ci.com/images/logos/TravisCI-Mascot-pride.png" height="100" />](https://travis-ci.org)
[<img src="https://xebialabs.com/wp-content/uploads/2018/10/yarn.png" height="100" />](https://yarnpkg.com)

## Requirement

Because this project use lerna and workspaces, you have to install `yarn` before build and run project.

```batch
npm install -g yarn
```

## Checkout

This repository provide getting started project example for each Ts.ED version since `v5.18.1`.

```bash
git checkout -b https://github.com/TypedProject/tsed-example-vue-js/tree/v5.18.1
```

To checkout another version just replace `v5.18.1` by the desired version.

## Install

> **Important!** Ts.ED requires Node >= 8, Express >= 4 and TypeScript >= 3.

```batch
yarn install
```

## Run

```
yarn start
```

## Starting a new project

Replace all reference `@project` by your project name. `@project` key are referenced in theses files:

- `package.json`,
- `client/package.json`,
- `server/package.json`

## Contributing

You can make a PR directly on https://github.com/TypedProject/ts-express-decorators repository.

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2020 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/
