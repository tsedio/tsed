<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/common</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

> A Node.js and TypeScript Framework on top of Express. It provides a lot of decorators and guidelines to write your
> code.

## What it is

Ts.ED is a framework on top of Express that helps you to write your application in TypeScript (or in ES6). It provides a
lot of decorators
to make your code more readable and less error-prone.

## Features

- Use our CLI to create a new project https://cli.tsed.io
- Support TypeORM, Mongoose, GraphQL, Socket.io, Swagger-ui, Passport.js, etc...
- Define class as Controller,
- Define class as Service (IoC),
- Define class as Middleware and MiddlewareError,
- Define class as Json Mapper (POJ to Model and Model to POJ),
- Define root path for an entire controller and versioning your Rest API,
- Define as sub-route path for a method,
- Define routes on GET, POST, PUT, DELETE and HEAD verbs,
- Define middlewares on routes,
- Define required parameters,
- Inject data from query string, path parameters, entire body, cookies, session or header,
- Inject Request, Response, Next object from Express request,
- Template (View),
- Testing.

## Documentation

Documentation is available on [https://tsed.io](https://tsed.io)

## Getting started

See our [getting started here](https://tsed.io/getting-started/) to create new Ts.ED project or use
our [CLI](https://cli.tsed.io)

## Examples

Examples are available on [https://tsed.io/tutorials/](https://tsed.io/tutorials/)

## Overview

### Server example

Here an example to create a Server with Ts.ED:

```typescript
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import "@tsed/platform-express";
import Path from "path";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";

@Configuration({
  port: 3000,
  middlewares: ["cookie-parser", "compression", "method-override", "json-parser", "urlencoded-parser"]
})
export class Server {}
```

To run your server, you have to use Platform API to bootstrap your application with the expected
platform like Express.

```typescript
import {$log} from "@tsed/logger";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server.js";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const platform = await PlatformExpress.bootstrap(Server);

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
```

To customize the server settings see [Configure server with decorator](https://tsed.io/docs/configuration.md)

#### Controller example

This is a simple controller to expose user resource. It use decorators to build the endpoints:

```typescript
import {Inject} from "@tsed/di";
import {Summary} from "@tsed/swagger";
import {
  Returns,
  ReturnsArray,
  Controller,
  Get,
  QueryParams,
  PathParams,
  Delete,
  Post,
  Required,
  BodyParams,
  Status,
  Put
} from "@tsed/schema";
import {BadRequest} from "@tsed/exceptions";
import {UsersService} from "../services/UsersService.js";
import {User} from "../models/User.js";

@Controller("/users")
export class UsersCtrl {
  @Inject()
  protected usersService: UsersService;

  @Get("/:id")
  @Summary("Get a user from his Id")
  @Returns(User)
  async getUser(@PathParams("id") id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post("/")
  @Status(201)
  @Summary("Create a new user")
  @Returns(User)
  async postUser(@Required() @BodyParams() user: User): Promise<User> {
    return this.usersService.save(user);
  }

  @Put("/:id")
  @Status(201)
  @Summary("Update the given user")
  @Returns(User)
  async putUser(@PathParams("id") id: string, @Required() @BodyParams() user: User): Promise<User> {
    if (user.id !== id) {
      throw new BadRequest("ID mismatch with the given payload");
    }

    return this.usersService.save(user);
  }

  @Delete("/:id")
  @Summary("Remove a user")
  @Status(204)
  async deleteUser(@PathParams("id") @Required() id: string): Promise<User> {
    await this.usersService.delete(user);
  }

  @Get("/")
  @Summary("Get all users")
  @ReturnsArray(User)
  async findUser(@QueryParams("name") name: string) {
    return this.usersService.find({name});
  }
}
```

## Contributors

Please read [contributing guidelines here](./CONTRIBUTING.md).

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2020 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/
