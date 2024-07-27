---
meta:
  - name: description
    content: Guide to deploy your Ts.ED application on AWS.
  - name: keywords
    content: ts.ed express typescript aws node.js javascript decorators
---

# Serverless HTTP

Ts.ED serverless provides a way to deploy your Ts.ED application on serverless platforms.

Ts.ED provides two packages to reach specific use cases:

- `@tsed/platform-serverless` to deploy optimized AWS Lambda functions,
- `@tsed/platform-serverless-http` to deploy serverless applications with a full HTTP Server like Express or Koa.

This documentation will be focused on the `@tsed/platform-serverless-http` package.

For more information about the `@tsed/platform-serverless` package, please refer to the [Serverless documentation](/docs/platform-serverless.md).

## Features

Under the hood, `@tsed/platform-serverless-http` uses [serverless-http](https://www.npmjs.com/package/serverless-http) to handle AWS event and call
Express.js/Koa.js application.

As a result, it supports:

- You can use Express.js or Koa.js to create your serverless application,
- It supports multiple cloud providers like AWS, Azure, Google Cloud, etc...
- DI injection with `@tsed/di`,
- Models mapping using `@tsed/schema` and `@tsed/json-mapper`,
- Params decorators can be used from `@tsed/platform-params` to get Query, Body, etc...
- Operation descriptions like `@Returns`,
- `@tsed/async-hook-context` to inject Context anywhere in your class!
- All ORM already available for other Ts.ED platform.

Note that, only APIGateway event are supported by this package.

## Installation

Generate a new project with the CLI (you can also start from an existing project):

```bash
tsed init .
? Choose the target platform: Express.js
? Choose the architecture for your project: Ts.ED
? Choose the convention file styling: Ts.ED
? Check the features needed for your project Swagger, Testing, Linter
? Choose unit framework Jest
? Choose linter tools framework EsLint
? Choose extra linter tools Prettier, Lint on commit
? Choose the package manager: Yarn
```

::: tip This tutorial works also with NPM package manager!
:::

<Tabs class="-code">
  <Tab label="Yarn">

```bash
yarn add @tsed/platform-serverless-http serverless-http serverless-offline
yarn add -D @types/aws-lambda
```

  </Tab>
  <Tab label="NPM">

```bash
npm install @tsed/platform-serverless-http serverless-http serverless-offline
npm install --save-dev @types/aws-lambda
```

  </Tab>
</Tabs>

In the `src/lambda` create a new Lambda class:

```typescript
import {Controller, Inject} from "@tsed/di";
import {Get, Returns, Summary} from "@tsed/schema";
import {QueryParams} from "@tsed/platform-params";
import {TimeslotsService} from "../services/TimeslotsService";
import {TimeslotModel} from "../models/TimeslotModel";

@Controller("/timeslots")
export class TimeslotsController {
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

Remove the http and https port configuration from `Server.ts`:

```typescript
@Configuration({
  // httpPort: 8080,
  // httpsPort: false
})
export class Server {}
```

And add the http port for our local server directly on `index.ts` file:

```typescript
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";

async function bootstrap() {
  const platform = await PlatformExpress.bootstrap(Server, {
    httpsPort: false,
    httpPort: process.env.PORT || 8080,
    disableComponentsScan: true
  });

  await platform.listen();

  return platform;
}

bootstrap();
```

Create new `handler.ts` to expose your lambda:

```typescript
import {PlatformServerlessHttp} from "@tsed/platform-serverless-http";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";

const platform = PlatformServerlessHttp.bootstrap(Server, {
  adapter: PlatformExpress
});

export const handler = platform.handler();
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
import {Controller, Get} from "@tsed/common";
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
import {Server} from "./Server";

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

## Author

<GithubContributors :users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors :users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
