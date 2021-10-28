---
meta:
 - name: description
   content: Guide to deploy your Ts.ED application on Serveless.
 - name: keywords
   content: ts.ed express typescript aws node.js javascript decorators

---
# Serverless

<Banner src="https://user-images.githubusercontent.com/2752551/30405068-a7733b34-989e-11e7-8f66-7badaf1373ed.png" href="https://www.serverless.com/fr/" :height="180" />

Serverless is a free and open-source web framework written using Node.js. Serverless is the first framework developed for building applications on AWS Lambda, a serverless computing platform provided by Amazon as a part of Amazon Web Services. This tutorial will show you how to install and use Serverless with Ts.ED.

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
import {Injectable, Controller} from "@tsed/di";
import {Returns, Summary, Get} from "@tsed/schema";
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
    })
  }
}
```

Create new handler.ts to expose your lambda:

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
export default platform.callbacks();
```

Finally, create the serverless.yml:

```yml
# Welcome to Serverless!
#
# This file is the main config file for your service.
# It's very minimal at this point and uses default values.
# You can always add more config options for more control.
# We've included some commented out config examples here.
# Just uncomment any of them to get that config option.
#
# For full config options, check the docs:
#    docs.serverless.com
#
# Happy Coding!

service: timeslots
# app and org for use with dashboard.serverless.com
#app: your-app-name
#org: your-org-name

# You can pin your service to only deploy with a specific Serverless version
# Check out our docs for more details
frameworkVersion: '2'

provider:
  name: aws
  runtime: nodejs12.x
  lambdaHashingVersion: 20201221

functions:
  timeslots:
    handler: handler.getTimeslots
    events:
      - http:
        path: /timeslots
        method: get
        cors: true
```

## Multiple lambda

In you lambda controller use Lambda decorators:

```typescript
import {Injectable} from "@tsed/di";
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
    })
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

## Author 

<GithubContributors :users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors :users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
