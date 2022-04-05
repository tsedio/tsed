---
meta:
  - name: description
    content: Guide to deploy your Ts.ED application on Serveless.
  - name: keywords
    content: ts.ed express typescript aws node.js javascript decorators
---

# Serverless

<Badge text="Contributors are welcome" />

<Banner src="/severless.png" href="https://www.serverless.com" :height="180" />

[Serverless](https://www.serverless.com/) is a free and open-source web framework written using Node.js. Serverless is
the first framework developed for building applications on AWS Lambda, a serverless computing platform provided by
Amazon as a part of Amazon Web Services. This tutorial will show you how to install and use Serverless with Ts.ED.

## Features

This package allows the creation of pure Lambda AWS without mounting an Express.js/Koa.js server.

It supports:

- Creating multiple lambda in one file,
- Support routing,
- DI injection with `@tsed/di`,
- Models mapping using `@tsed/schema` and `@tsed/json-mapper`,
- Params decorators can be used from `@tsed/platform-params` to get Query, Body, etc...
- Response can be modified by using `@tsed/platform-response-filter`,
- All error can be handled by using `@tsed/platform-exceptions`,
- Operation descriptions like `@Returns`,
- `@tsed/async-hook-context` to inject Context anywhere in your class!
- All ORM already available for other Ts.ED platform.

## Unsupported features

::: warning Some features that you can use with the Express.js or Koa.js platforms are not available with the Serverless
platform.
(See also our [table feature capabilities](/getting-started/#platform-features-support)).
:::

### Middlewares

This mechanism is specific to Koa.js / Express.js and doesn't exist with the Serverless approach.

Serverless provides a number of features such as Cors management via the configuration of `serverless.yml` and doesn't
need to use middleware. In addition, serverless [plugins](https://www.serverless.com/plugins/) are also available and
allow you to manage advanced scenarios without having to develop anything!

If you can't find what you are looking for on the Serverless side, you can use `@tsed/di`'
s [Interceptors](/docs/interceptors.md) to decorate the methods and add shareable features.

### Passport/OIDC/GraphQL etc...

Because middlewares aren't supported Passport.js, OIDC, GraphQL won't be usable in this platform either.

### Upload files

File upload isn't covered at this time. Any help is welcome to improve this platform :).

### Statics files

The goal of lambda isn't to expose static files. We do not plan to support this use in the near future.

## Rule

::: warning By convention, try to not import something from `@tsed/common`. `@tsed/common` embed a lot of codes designed
for the Full server platform which are not necessary in the Serverless context and aren't optimized for it.

The recent version of Ts.ED expose all necessary decorators from `@tsed/schema`, `@tsed/platform-params` or `@tsed/di`.
For example, @@Get@@ or @@Post@@ are commonly imported like this:

```typescript
import {Get} from "@tsed/common";
```

Now, you have to import the decorator from `@tsed/schema`.

```typescript
import {Get} from "@tsed/schema";
```

:::

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

::: tip
This tutorial works also with NPM package manager!
:::

<Tabs class="-code">
  <Tab label="Yarn">

```bash
yarn add @tsed/platform-serverless serverless serverless-offline
yarn add -D @types/aws-lambda
```

  </Tab>
  <Tab label="NPM">

```bash
npm install --save @tsed/platform-serverless serverless serverless-offline
npm install --save-dev @types/aws-lambda
```

  </Tab>
</Tabs>

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
  lambda: [TimeslotsLambda]
  // put your Application configuration here
});

// then export the lambda
export = platform.callbacks();
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
  timeslots:
    handler: dist/handler.getTimeslots
    events:
      - http:
          path: /timeslots
          method: get
```

## Invoke a lambda with serverless

Serverless provide a plugin named `serverless-offline`. This Serverless plugin emulates AWS λ and API Gateway on your
local machine to speed up your development cycles. To do so, it starts an HTTP server that handles the request's
lifecycle like APIG does and invokes your handlers.

So, by using the `serverless offline` command, we'll be able to invoke our function. For that, we need also to build our
code before invoke the lambda.

To simplify our workflow, we can add the following npm script command in our `package.json`:

```json
{
  "scripts": {
    "invoke:timeslots": "yarn build && serverless invoke local -f timeslots"
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

Declaring all routes in the `serverless.yml` file can be a source of error. `@tsed/platform-serverless` can handle all
routes and call the right lambda based on the decorators like @@Get@@, @@Post@@, etc...

To use the embed router, change the `serverless.yml` declaration by this example:

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
    console.log($ctx.context); // AWS Context
    console.log($ctx.event); // AWS Event
    console.log($ctx.response); // Response Platform abstraction layer
    console.log($ctx.request); // Request Platform abstraction layer

    $ctx.response.setHeader("x-test", "test");

    return {};
  }
}
```

## Testing

Ts.ED provide a way to test you lambda with mocked Aws event and context by using the @@PlatformServerlessTest@@ util.

Here an example to test a Lambda controller:

```typescript
import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {PlatformServerless} from "@tsed/platform-serverless";

@Controller("/")
class TimeslotsLambdaController {
  @Get("/")
  getAll() {
    return [];
  }

  @Get("/:id")
  getById(@PathParams("id") id: string, @QueryParams("start_date") startDate: Date, @QueryParams("end_date") endDate: Date) {
    return {
      id,
      startDate,
      endDate
    };
  }
}

describe("TimeslotsLambdaController", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [TimeslotsLambdaController]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe("Invoke by lambda name", () => {
    it("should call getAll Lambda", async () => {
      const response = await PlatformServerlessTest.request.call("getAll");

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        "x-request-id": "requestId",
        "content-type": "application/json"
      });
      expect(JSON.parse(response.body)).toEqual([]);
    });

    it("should call getAll Lambda", async () => {
      const response = await PlatformServerlessTest.request
        .call("getById")
        .params({
          id: "1"
        })
        .query({
          start_date: new Date("2020-01-01"),
          end_date: new Date("2020-01-10")
        });

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        "x-request-id": "requestId",
        "content-type": "application/json"
      });
      expect(JSON.parse(response.body)).toEqual({
        id: "1",
        endDate: "2020-01-10T00:00:00.000Z",
        startDate: "2020-01-01T00:00:00.000Z"
      });
    });
  });

  describe("invoke using the router", () => {
    it("should call getAll Lambda", async () => {
      const response = await PlatformServerlessTest.request.get("/");

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        "x-request-id": "requestId",
        "content-type": "application/json"
      });
      expect(JSON.parse(response.body)).toEqual([]);
    });
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
