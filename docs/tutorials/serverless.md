---
meta:
  - name: description
    content: Guide to deploy your Ts.ED application on Serveless.
  - name: keywords
    content: ts.ed express typescript aws node.js javascript decorators
projects:
  - title: Kit Serverless
    href: https://github.com/tsedio/tsed-example-aws
    src: /serverless.png
---

# Serverless

<Banner src="/serverless.png" href="https://www.serverless.com" :height="180" />

[Serverless](https://www.serverless.com/) is a free and open-source web framework written using Node.js. Serverless is
the first framework developed for building applications on AWS Lambda, a serverless computing platform provided by
Amazon as a part of Amazon Web Services. This tutorial will show you how to install and use Serverless with Ts.ED.

## Installation

See the [Platform Serverless](/docs/platform-serverless.md) to install the required packages
to develop your AWS Lambda functions.

## Create your first lambda

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
const {getTimeslot} = platform.callbacks(); // build all handlers of TimeslotsLambda

export {getTimeslot};
```

::: tip
Since v7.66.0, you can use the `PlatformServerless.callback(TimeslotsLambda, 'get')` method to build and get the lambda handler.

```typescript
import {PlatformServerless} from "@tsed/serverless";

export const getTimeslots = PlatformServerless.callback(TimeslotsLambda, "get", {
  // extra options
});
```

This method doesn't use the `find-my-way` router and is faster than the `handler` method.
:::

Finally, create the `serverless.yml`:

```yml
service: timeslots

frameworkVersion: "3.21.0"

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

## Author

<GithubContributors :users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors :users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
