<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/platform-serverless</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![Coverage Status](https://coveralls.io/repos/github/tsedio/tsed/badge.svg?branch=production)](https://coveralls.io/github/tsedio/tsed?branch=production)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![backers](https://opencollective.com/tsed/tiers/badge.svg)](https://opencollective.com/tsed)

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

A package of Ts.ED framework. See website: https://tsed.io/

## Features

This package allows the creation of pure Lambda AWS without mounting an Express.js/Koa.js server.

It supports:

- Creating multiple lambda in one file,
- DI injection with `@tsed/di`,
- Models mapping using `@tsed/schema` and `@tsed/json-mapper`,
- Params decorators can be used from `@tsed/platform-params` to get Query, Body, etc...
- Operation descriptions like `@Returns`,
- `@tsed/async-hook-context` to inject Context anywhere in your class!

## Installation

```bash
npm install --save @tsed/platform-serverless
```

## Configuration

In the `src/lambda` create a new Lambda class:

```typescript
import {Controller, Inject} from "@tsed/di";
import {Get, Returns, Summary} from "@tsed/schema";
import {QueryParams} from "@tsed/platform-params"; // /!\ don't import decorators from @tsed/common
import {TimeslotsService} from "../services/TimeslotsService";
import {TimeslotModel} from "../models/TimeslotModel";

@Controller("/timeslots")
export class TimeslotsLambda {
  @Inject()
  protected timeslotsService: TimeslotsService;

  @Get("/")
  @Summary("Return a list of timeslots")
  @Returns(200, Array).Of(TimeslotModel)
  get(@QueryParams("date_start") dateStart: Date, @QueryParams("date_end") dateEnd: Date) {
    return this.timeslotsService.find({
      dateStart,
      dateEnd
    });
  }
}
```

Create new `handler.ts` to expose your lambda:

```typescript
import {PlatformServerless} from "@tsed/serverless";
import {TimeslotsLambda} from "./lambda/TimeslotsLambda";

const platform = PlatformServerless.bootstrap({
  lambda: [
    TimeslotsLambda
  ]
  // put your Application configuration here
})

// then export the lambda
export = platform.callbacks();
```

Finally, create the `serverless.yml`:

```yml
service: timeslots

frameworkVersion: '2'

provider:
   name: aws
   runtime: nodejs14.x
   lambdaHashingVersion: '20201221'

plugins:
   - serverless-offline

functions:
   timeslots:
      handler: dist/handler.getTimeslots
      events:
         - http:
              path: /timeslots
              method: get
```

## Invoke a lambda with serverless

Serverless provide a plugin named `serverless-offline`. This Serverless plugin emulates AWS λ and API Gateway on your local machine to speed up your development cycles.
To do so, it starts an HTTP server that handles the request's lifecycle like APIG does and invokes your handlers.

So, by using the `serverless offline` command, we'll be able to invoke our function. For that, we need also to build our code before invoke the lambda.

To simplify our workflow, we can add the following npm script command in our `package.json`:

```json
{
  "scripts": {
    "invoke:timeslots": "yarn build && serverless invoke local -f timeslots",
    "invoke:any": "yarn serverless invoke local -f any --data '{\"path\":\"/timeslots\", \"httpMethod\": \"GET\"}'"
  }
}
```

Now, we can run the following command to invoke our lambda:

```
yarn invoke:timeslots
// OR
npm run invoke:timeslots
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

## Manage routes from code

Declaring all routes in the `serverless.yml` file can be a source of error. `@tsed/platform-serverless` can
handle all routes and call the right lambda based on the decorators like `@Get`, `@Post`, etc...

To use the embed router, change the `serverless.yml` declaration by this example:

```yml
service: timeslots

frameworkVersion: '2'

provider:
   name: aws
   runtime: nodejs14.x
   lambdaHashingVersion: '20201221'

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
          path: '{proxy+}'
```

Then, edit the `handler.ts` and change the exported functions:

```typescript
import {PlatformServerless} from "@tsed/platform-serverless";
import {TimeslotsLambda} from "./TimeslotsLambda";

const platform = PlatformServerless.bootstrap({
  lambda: [TimeslotsLambda]
});

export const handler = platform.handler();
```

Now, Ts.ED will handle request and call the expected lambda in your controllers.

To simplify our workflow, we can add the following npm script command in our `package.json`:

```json
{
  "scripts": {
    "invoke:any": "yarn serverless invoke local -f any --data '{\"path\":\"/timeslots\", \"httpMethod\": \"GET\"}'"
  }
}
```

## Get AwsContext and AwsEvent

```typescript
import {Injectable} from "@tsed/di";
import {QueryParams, ServerlessContext} from "@tsed/platform-serverless"; // /!\ don't import decorators from @tsed/common
import {TimeslotsService} from "../services/TimeslotsService";
import {ServerlessContext} from "./ServerlessContext";

@Injectable()
export class TimeslotsLambda {
  get(@Context() $ctx: ServerlessContext) {
    console.log($ctx.context) // AWS Context
    console.log($ctx.event) // AWS Event
    console.log($ctx.response) // Response Platform abstraction layer
    console.log($ctx.request) // Request Platform abstraction layer

    $ctx.response.setHeader('x-test', 'test');
    
    return {}
  }
}
```

## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html).

<a href="https://github.com/tsedio/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
