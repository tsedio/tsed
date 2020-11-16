# @tsed/mongoose

[![Build Status](https://travis-ci.org/TypedProject/tsed.svg?branch=master)](https://travis-ci.org/TypedProject/tsed)
[![Coverage Status](https://coveralls.io/repos/github/TypedProject/tsed/badge.svg?branch=production)](https://coveralls.io/github/TypedProject/tsed?branch=production)
![npm](https://img.shields.io/npm/dm/@tsed/common.svg)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![Dependencies](https://david-dm.org/TypedProject/tsed.svg)](https://david-dm.org/TypedProject/tsed#info=dependencies)
[![img](https://david-dm.org/TypedProject/tsed/dev-status.svg)](https://david-dm.org/TypedProject/tsed/#info=devDependencies)
[![img](https://david-dm.org/TypedProject/tsed/peer-status.svg)](https://david-dm.org/TypedProject/tsed/#info=peerDependenciess)
[![Known Vulnerabilities](https://snyk.io/test/github/TypedProject/tsed/badge.svg)](https://snyk.io/test/github/TypedProject/tsed)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![backers](https://opencollective.com/tsed/tiers/badge.svg)](https://opencollective.com/tsed)


<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

A package of Ts.ED framework. See website: https://tsed.io/tutorials/objection.html

## Feature

Currently, `@tsed/objection` allows you:
 
- Configure one database connection via the `@Configuration` decorator. 
- Databases will be initialized when the server starts during the server's `OnInit` phase.
- Declare a Model from a class with annotation,

> Note: `@tsed/objection` use the JsonSchema and his decorators to generate the table.

## Installation

Before using the `@tsed/objection` package, we need to install the [Obection.js](https://www.npmjs.com/package/objection) and [Knex](https://www.npmjs.com/package/knex) modules.

Install the dependencies:

```bash
npm install --save @tsed/objection objection knex
```

We also need to install one of the following depending on the database you want to use:

```bash
npm install pg
npm install sqlite3
npm install mysql
npm install mysql2
```

## Configuration

Add a `knex` configuration to your Ts.ED configuration (see: http://knexjs.org/#Installation-client for options):

```typescript
import {Server} from "@tsed/common";
import "@tsed/objection"; // don't forget to add this line!

@Configuration({
  // ...
  knex: {
    client: 'sqlite3',
    connection: ':memory:'
  }
})
class Server {}
```


## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
