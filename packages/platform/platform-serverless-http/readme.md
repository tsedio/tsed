<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>Platform Serverless Http</h1>

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

A package of Ts.ED framework. See website: https://tsed.io/tutorials/aws.html

## Features

This package allows the creation of a Lambda AWS with an Express.js/Koa.js server.

It supports:

- Mounting Express.js/Koa.js app with `serverless-http` module,
- DI injection with `@tsed/di`,
- Models mapping using `@tsed/schema` and `@tsed/json-mapper`,
- Params decorators can be used from `@tsed/platform-params` to get Query, Body, etc...
- Operation descriptions like `@Returns`,
- `@tsed/async-hook-context` to inject Context anywhere in your class!

## Installation

```bash
npm install --save @tsed/platform-serverless-http serverless-http serverless-offline
npm install --save-dev @types/aws-lambda
```

## Configuration

In the `src/lambda` create a new Lambda class:

```typescript
import {Controller, Inject} from "@tsed/di";
import {Get, Returns, Summary} from "@tsed/schema";
import {QueryParams} from "@tsed/platform-params";
import {TimeslotsService} from "../services/TimeslotsService.js";
import {TimeslotModel} from "../models/TimeslotModel.js";

@Controller("/timeslots")
export class TimeslotsController {
  @Inject()
  protected timeslotsService: TimeslotsService;

  @Get("/")
  @Summary("Return a list of timeslots")
  @(Returns(200, Array).Of(TimeslotModel))
  get(@QueryParams("date_start") dateStart: Date, @QueryParams("date_end") dateEnd: Date) {
    return this.timeslotsService.find({
      dateStart,
      dateEnd
    });
  }
}
```

Create new `Server.ts` to configure your Ts.ED application:

```typescript
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import cors from "cors";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import "@tsed/ajv";
import "@tsed/swagger";
import {TimeslotsController} from "./controllers/TimeslotsController.js";

@Configuration({
  acceptMimes: ["application/json"],
  mount: {
    "/": [TimeslotsController]
  },
  swagger: [
    {
      path: "/v3/docs",
      specVersion: "3.0.1"
    }
  ],
  views: {
    root: "${rootDir}/views",
    extensions: {
      ejs: "ejs"
    }
  },
  middlewares: ["cors", "cookie-parser", "compression", "method-override", "json-parser", "urlencoded-parser"]
})
export class Server {}
```

Create new `handler.ts` to expose your lambda:

```typescript
import {PlatformServerless} from "@tsed/platform-serverless-http";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server.js";

const platform = PlatformServerless.bootstrap(Server, {
  adapter: PlatformExpress
});

export const handler = platform.handler();
```

Create also `index.ts` to expose run Ts.ED on you local machine:

```typescript
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server.js";

async function bootstrap() {
  const platform = await PlatformExpress.bootstrap(Server, {
    httpsPort: false,
    httpPort: process.env.PORT || 3000,
    disableComponentsScan: true
  });

  await platform.listen();

  return platform;
}

bootstrap();
```

Finally, create the `serverless.yml`:

```yml
service: timeslots

frameworkVersion: "2"

provider:
  name: aws
  runtime: nodejs14.x
  lambdaHashingVersion: "20201221"

plugins:
  - serverless-offline

functions:
  any:
    handler: dist/handler.handler
    events:
      - http:
          method: ANY
          path: /
      - http:
          method: ANY
          path: "{proxy+}"
```

## Invoke a lambda with serverless

Serverless provide a plugin named `serverless-offline`. This Serverless plugin emulates AWS λ and API Gateway on your
local machine to speed up your development cycles. To do so, it starts an HTTP server that handles the request's
lifecycle like API does and invokes your handlers.

So, by using the `serverless offline` command, we'll be able to invoke our function. For that, we need also to build our
code before invoke the lambda.

To simplify our workflow, we can add the following npm script command in our `package.json`:

```json
{
  "scripts": {
    "invoke": "yarn serverless invoke local -f any --data '{\"path\":\"/timeslots\", \"httpMethod\": \"GET\"}'"
  }
}
```

Now, we can run the following command to invoke our lambda:

```
yarn invoke
// OR
npm run invoke
```

You should see in the terminal the following result:

```json
{
  "statusCode": 200,
  "body": "[{\"id\":\"b6de4fc7-faaa-4cd7-a144-42f6af0dec6b\",\"title\":\"title\",\"description\":\"description\",\"start_date\":\"2021-10-29T10:40:57.019Z\",\"end_date\":\"2021-10-29T10:40:57.019Z\",\"created_at\":\"2021-10-29T10:40:57.019Z\",\"update_at\":\"2021-10-29T10:40:57.019Z\"}]",
  "headers": {
    "content-type": "application/json",
    "x-request-id": "ebb52d5e-113b-40da-b34e-c14811df596b"
  },
  "isBase64Encoded": false
}
```

## Get Aws Context and Aws Event

This package includes decorators to easily get the event object Lambda received from API Gateway:

```typescript
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {ServerlessEvent, ServerlessContext} from "@tsed/platform-serverless-http";

@Controller("/")
class MyCtrl {
  @Get("/")
  get(@ServerlessEvent() event: any, @ServerlessContext() context: ServerlessContext) {
    console.log("Event", event);
    console.log("Context", context);

    return {event, context};
  }
}
```

## Testing

Ts.ED provide a way to test you lambda with mocked Aws event and context by using the @@PlatformServerlessTest@@ util.

Here an example to test a Lambda controller:

```typescript
import {PlatformServerless} from "@tsed/platform-serverless-http";
import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server.js";

@Controller("/timeslots")
class TimeslotsController {
  @Get("/")
  getAll() {
    return [];
  }
}

describe("TimeslotsController", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerlessHttp, {
      server: Server,
      mount: {
        "/": [TimeslotsLambdaController]
      }
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  it("should call getAll Lambda", async () => {
    const response = await PlatformServerlessTest.request.get("/timeslots");

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual([]);
  });
});
```

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

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
