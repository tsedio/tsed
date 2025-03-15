<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/platform-router</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.dev/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.dev/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://slack.tsed.dev">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package of Ts.ED framework. See website: https://tsed.dev/

# Installation

```bash
npm install --save @tsed/platform-router
```

## Usage

This module generates routers from decorated class.

```typescript
import express from "express";
import {Controller, InjectorService} from "@tsed/di";
import {PlatformHandlerType, PlatformHandlerMetadata, PlatformRouter, PlatformLayer} from "@tsed/platform-router";
import {Delete, Get, Head, Options, Patch, Post, Put} from "@tsed/schema";

@Controller("/nested")
class NestedController {
  @Get("/")
  get() {}

  @Post("/")
  post() {}

  @Put("/:id")
  put() {}

  @Delete("/:id")
  delete() {}

  @Head("/:id")
  head() {}

  @Options("/:id")
  option() {}

  @Patch("/:id")
  patch() {}
}

@Controller({path: "/controller", children: [NestedController]})
@UseBefore(function useBefore() {})
class MyController {
  @Get("/")
  get() {}

  @Post("/")
  post() {}

  @Put("/:id")
  put() {}

  @Delete("/:id")
  delete() {}

  @Head("/:id")
  head() {}

  @Options("/:id")
  option() {}

  @Patch("/:id")
  patch() {}
}

const injector = new InjectorService();

const expressApp = express();

injector.addProvider(MyController);
injector.addProvider(NestedController);

const appRouter = new PlatformRouter(injector);

appRouter.use("/rest", MyController);

// transform handlerMetadata to a compatible handler for the targeted framework (Express.js, Koa.js, etc...)
PlatformRouter.hooks.on("alterHandler", (handlerMetadata: PlatformHandlerMetadata) => {
  if (!handlerMetadata.isInjectable()) {
    return handlerMetadata.handler;
  }

  const handler = this.platformParams.compileHandler(handlerMetadata);

  switch (handlerMetadata.type) {
    case PlatformHandlerType.DEFAULT:
    case PlatformHandlerType.ENDPOINT:
    case PlatformHandlerType.MIDDLEWARE:
      const handler = platformParams.compileHandler(handlerMetadata);

      return (req, res, next) => {
        return handler({$ctx: {next, request: req, response: res}});
      };
    case PlatformHandlerType.ERR_MIDDLEWARE:
      return (error: unknown, req, res, next) => {
        return handler({$ctx: {error, next, request: req, response: res}});
      };
  }
});

// bind layers to the framework router
appRouter.getLayers().forEach((layer: PlatformLayer) => {
  const {method, args} = layer;

  expressApp[method](...layer.args);
});

expressApp.listen(3000);
```

## Contributors

Please read [contributing guidelines here](https://tsed.dev/contributing.html).

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

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
