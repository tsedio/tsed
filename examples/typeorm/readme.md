# Ts.ED - TypeORM

Here an example project with TypeORM and Ts.ED framework.

See [Ts.ED](https://tsed.io) project for more information.

## Features

- Docker and Docker compose
- Travis CI
- TypeORM

[<img src="https://www.docker.com/sites/default/files/social/docker_facebook_share.png" height="100" />](https://docker.com)
[<img src="https://travis-ci.com/images/logos/TravisCI-Mascot-pride.png" height="100" />](https://travis-ci.org)
[<img src="https://raw.githubusercontent.com/typeorm/typeorm/master/resources/logo_big.png" height="100" />](https://typeorm.io/)


## Checkout

This repository provide getting started project example for each Ts.ED version since `v5.18.1`.

```bash
git checkout -b https://github.com/TypedProject/tsed-example-typeorm/tree/v5.18.1
```

To checkout another version just replace `v5.18.1` by the desired version.

## Install

> **Important!** Ts.ED requires Node >= 8, Express >= 4 and TypeScript >= 3.

```batch
yarn install
```

# Start with Docker

Run:
```
yarn docker:build
docker-compose up
```

## Access to postgres: 

* `localhost:5432`
* **Username:** postgres (as a default)
* **Password:** changeme (as a default)

## Access to PgAdmin: 
* **URL:** `http://localhost:5050`
* **Username:** pgadmin4@pgadmin.org (as a default)
* **Password:** admin (as a default)

## Add a new server in PgAdmin:
* **Host name/address** `postgres`
* **Port** `5432`
* **Username** as `POSTGRES_USER`, by default: `postgres`
* **Password** as `POSTGRES_PASSWORD`, by default `changeme`

## Contributing

You can make a PR directly on https://github.com/TypedProject/ts-express-decorators repository.

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2019 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/
