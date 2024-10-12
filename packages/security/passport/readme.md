<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>Passport.js</h1>

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

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/passport

## Installation

Run npm command (or yarn):

```bash
npm install --save @tsed/passport passport
npm install --save-dev @types/passport
```

## Configure your server

Add this configuration to your server:

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  componentsScan: [
    `./protocols/*.ts` // scan protocols directory
  ],
  passport: {}
})
export class Server {}
```

## Create a new Protocol

A Protocol is a special Ts.ED service which is used to declare a Passport Strategy and handle Passport lifecycle.

Here an example with the PassportLocal:

```typescript
import {BodyParams} from "@tsed/platform-params";
import {Format, Required} from "@tsed/schema";
import {Req} from "@tsed/platform-http";
import {Strategy} from "passport-local";
import {Unauthorized} from "@tsed/exceptions";
import {Protocol, OnInstall, OnVerify} from "@tsed/passport";
import {Inject} from "@tsed/di";
import {UserService} from "../services/UserService.js";

export class Credentials {
  @Required()
  @Format("email")
  email: string;

  @Required()
  password: string;
}

@Protocol({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class LocalProtocol implements OnVerify, OnInstall {
  @Inject(UserService)
  private userService: UserService;

  async $onVerify(@Req() request: Req, @BodyParams() credentials: Credentials) {
    const user = await this.userService.find(credentials);

    if (!user) {
      throw new Unauthorized("Unauthorized user");
    }

    if (!user.verifyPassword()) {
      throw new Unauthorized("Unauthorized user");
    }

    return user;
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
```

## Create the Passport controller

Create a new Passport controller as following:

```typescript
import {BodyParams} from "@tsed/platform-params";
import {Req} from "@tsed/platform-http";
import {Get, Post} from "@tsed/schema";
import {Controller, ProviderScope, Scope} from "@tsed/di";
import {Authenticate} from "@tsed/passport";

@Controller("/")
@Scope(ProviderScope.SINGLETON)
export class PassportCtrl {
  @Post("/login")
  @Authenticate("login")
  login(@Req() req: Req, @BodyParams("email") email: string, @BodyParams("password") password: string) {
    // FACADE
    return req.user;
  }
}
```

This controller will provide required all endpoints which will be used by the different protocols.

See our complete example on [Ts.ED passport repository](https://github.com/tsedio/tsed-example-passportjs).

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
