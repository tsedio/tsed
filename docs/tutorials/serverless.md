---
meta:
 - name: description
   content: Guide to deploy your Ts.ED application on Serveless.
 - name: keywords
   content: ts.ed express typescript aws node.js javascript decorators

---
# Serverless

<Badge text="beta" /> <Badge text="Contributors are welcome" />

<Banner src="https://user-images.githubusercontent.com/2752551/30405068-a7733b34-989e-11e7-8f66-7badaf1373ed.png" href="https://www.serverless.com/fr/" :height="180" />

[Serverless](https://www.serverless.com/) is a free and open-source web framework written using Node.js. Serverless is the first framework developed for building applications on AWS Lambda, a serverless computing platform provided by Amazon as a part of Amazon Web Services. This tutorial will show you how to install and use Serverless with Ts.ED.

## Features

This package allows the creation of pure Lambda AWS without mounting an Express.js/Koa.js server.

It supports:

- Creating multiple lambda in one file,
- DI injection with `@tsed/di`,
- Models mapping using `@tsed/schema` and `@tsed/json-mapper`,
- Params decorators can be used from `@tsed/platform-params` to get Query, Body, etc...
- Response can be modified by using `@tsed/platform-response-filter`,
- All error can be handled by using `@tsed/platform-exceptions`,
- Operation descriptions like `@Returns`,
- `@tsed/async-hook-context` to inject Context anywhere in your class!
- All ORM already available for other Ts.ED platform.
 
## Unsupported features

::: warning
Some features that you can use with the Express.js or Koa.js platforms are not available with the Serverless platform.
(See also our [table feature capabilities](/getting-started/#platform-features-support)).
:::

### Middlewares

This mechanism is specific to Koa.js / Express.js and doesn't exist with the Serverless approach.

Serverless provides a number of features such as Cors management via the configuration of `serverless.yml` and doesn't need to use middleware.
In addition, serverless [plugins](https://www.serverless.com/plugins/) are also available and allow you to manage advanced scenarios without having to develop anything!

If you can't find what you are looking for on the Serverless side, you can use `@tsed/di`'s [Interceptors](/docs/interceptors.md) to decorate the methods and add shareable features.

### Passport/OIDC/GraphQL etc...

Because middlewares aren't supported Passport.js, OIDC, GraphQL won't be usable in this platform either.

### Upload files

File upload isn't covered at this time. Any help is welcome to improve this platform :).

### Statics files

The goal of lambda isn't to expose static files. We do not plan to support this use in the near future.

## Rule

::: warning
Serverless Platform doesn't depend on `@tsed/common` package. It's important to not use decorators/services/middlewares from `@tsed/common`.

For example, the followings example will throw an error at runtime:
```typescript
import {Get} from "@tsed/common";
```

To fix that, import the decorator from `@tsed/schema`.

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

## Author 

<GithubContributors :users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors :users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
