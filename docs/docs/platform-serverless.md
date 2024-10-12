---
meta:
  - name: description
    content: Guide to deploy your Ts.ED application on AWS.
  - name: keywords
    content: ts.ed express typescript serverless aws function node.js javascript decorators
projects:
  - title: Terraform project
    href: https://github.com/tsedio/tsed-aws-lambda
    src: /terraform.png
  - title: Serverless project
    href: https://github.com/tsedio/tsed-example-aws
    src: /serverless.png
---

# Platform Serverless

<Banner src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/langfr-220px-Amazon_Web_Services_Logo.svg.png" href="https://aws.amazon.com/fr/" :height="180" />

Ts.ED provides two packages to reach specific use cases:

- `@tsed/platform-serverless` to deploy optimized AWS Lambda functions,
- `@tsed/platform-serverless-http` to deploy serverless applications with a full HTTP Server like Express.js or Koa.js.

This documentation will be essentially focused on the `@tsed/platform-serverless` package.

For more information about the `@tsed/platform-serverless-http` package, please refer to
the [Serverless HTTP documentation](/docs/platform-serverless-http.md).

## Features

This package provides a way to deploy your Ts.ED application on AWS using the AWS API Gateway and AWS Lambda.
It's useful if you want to deploy your application on AWS without any dependencies on Express or Koa.

This is the best choice if you want to deploy optimized AWS Lambda.

Here the supported features:

- Creating multiple lambda in one file,
- Support routing using find-my-way (the awesome router supported by Fastify),
- DI injection with `@tsed/di`,
- Models mapping using `@tsed/schema` and `@tsed/json-mapper`,
- Params decorators can be used from `@tsed/platform-params` to get Query, Body, etc...
- Response can be modified by using `@tsed/platform-response-filter`,
- All error can be handled by using `@tsed/platform-exceptions`,
- Operation descriptions like `@Returns`,
- `@tsed/async-hook-context` to inject Context anywhere in your class!
- All ORM already available for other Ts.ED platform,
- All kind of lambda can be handled (APIGateway, Lambda Auth, SQS, etc...),
- Streaming response

## Unsupported features

### Middlewares

This mechanism is specific to Koa.js / Express.js and doesn't exist with the Serverless approach.

Serverless provides a number of features such as Cors management via the configuration of `serverless.yml` and doesn't
need to use middleware. In addition, serverless [plugins](https://www.serverless.com/plugins/) are also available and
allow you to manage advanced scenarios without having to develop anything!

If you can't find what you are looking for on the Serverless side, you can use `@tsed/di`'
s [Interceptors](/docs/interceptors.md) to decorate the methods and add shareable features.

### Passport/OIDC/GraphQL, etc.

Because middlewares aren't supported Passport.js, OIDC, GraphQL won't be usable in this platform either.

### Upload files

File upload isn't covered at this time. Any help is welcome to improve this platform :).

### Statics files

The goal of lambda isn't to expose static files. We do not plan to support this use in the near future.

## Rule

::: warning
By convention, try to not import something from `@tsed/common`. `@tsed/common` embed a lot of codes designed
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

::: note
With v8 `@tsed/common` are replaced by `@tsed/platform-http`, the same convention is available for `@tsed/platform-http`, but now `@tsed/platform-http` doesn't re-export `@tsed/schema`. So your IDE, won't try to import schema decorator from the unexpected package.
:::

## Projects example

<Projects type="projects" />

## Installation

The best option is to checkout the full terraform project available
on [GitHub](https://github.com/tsedio/tsed-aws-lambda).
This quick start project provides:

- Stack to build and deploy lambda using localstack,
- Monorepo structure to develop lambda, [commands](/docs/command.md) and standard Ts.ED application,
- DynamoDB code example,
- Unit tests and e2e tests examples,
- GitHub actions to run tests,
- Terraform configuration to deploy lambda on AWS,
- Lambda Authorizer example.

It's also a full ESM stack!

You can also start from an existing project or generate a new project with the CLI:

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

Or you can install the package manually:

<Tabs class="-code">
  <Tab label="npm">

```bash
npm install --save @tsed/platform-serverless serverless serverless-offline
npm install --save-dev @types/aws-lambda
```

  </Tab>
  <Tab label="yarn">

```bash
yarn add @tsed/platform-serverless serverless serverless-offline
yarn add -D @types/aws-lambda
```

  </Tab>
  <Tab label="pnpm">

```bash
pnpm add @tsed/platform-serverless serverless serverless-offline
pnpm add -D @types/aws-lambda
```

  </Tab>
  <Tab label="bun.js">

```bash
bun add @tsed/platform-serverless serverless serverless-offline
bun add -D @types/aws-lambda
```

  </Tab>
</Tabs>

## Create your first Lambda

Create a new folder `src/lambda` and create a new Ts.ED controller:

```typescript
import {Controller, Inject} from "@tsed/di";
import {Get, Returns, Summary} from "@tsed/schema";
import {QueryParams} from "@tsed/platform-params"; // /!\ don't import decorators from @tsed/common
import {TimeslotsService} from "../services/TimeslotsService";
import {TimeslotModel} from "../models/TimeslotModel";

@Controller("/timeslots")
export class TimeslotsController {
  @Inject()
  protected timeslotsService: TimeslotsService;

  @Get("/")
  @Summary("Return a list of timeslots")
  @(Returns(200, Array).Of(TimeslotModel))
  getAll(@QueryParams("date_start") dateStart: Date, @QueryParams("date_end") dateEnd: Date) {
    return this.timeslotsService.find({
      dateStart,
      dateEnd
    });
  }
}
```

Create new `handler.ts` to expose your lambda:

```typescript
import "@tsed/ajv"; // enable validation
import {PlatformServerless} from "@tsed/platform-serverless";
import {TimeslotsController} from "./TimeslotsController.js";

const config = {
  envs: process.env
};

export const timeslots = PlatformServerless.callback(TimeslotsController, "getAll", config);
```

That's it! You can now deploy your lambda on AWS.

::: tip
If you want to have mode details on how to deploy your lambda
using the Serverless framework, please read the dedicated tutorial [here](/docs/tutorials/serverless.md).
:::

::: tip
Our project example provides a full terraform configuration to deploy your lambda on AWS.
See more details on https://github.com/tsedio/tsed-aws-lambda/tree/main/packages/lambda/terraform.
:::

## Expose multiple lambda in one file

You can expose multiple lambda in one file. Just create a new controller with different methods like that:

```typescript
import {Controller, Inject} from "@tsed/di";
import {Get, Returns, Summary} from "@tsed/schema";
import {QueryParams} from "@tsed/platform-params"; // /!\ don't import decorators from @tsed/common
import {TimeslotsService} from "../services/TimeslotsService";
import {TimeslotModel} from "../models/TimeslotModel";

@Controller("/timeslots")
export class TimeslotsController {
  @Inject()
  protected timeslotsService: TimeslotsService;

  @Get("/:id")
  getById() {
    // code
  }

  @Get("/")
  @Summary("Return a list of timeslots")
  @(Returns(200, Array).Of(TimeslotModel))
  getAll(@QueryParams("date_start") dateStart: Date, @QueryParams("date_end") dateEnd: Date) {
    return this.timeslotsService.find({
      dateStart,
      dateEnd
    });
  }
}
```

Now we need to expose the all controller methods in the `handler.ts` file:

```typescript
import "@tsed/ajv"; // enable validation
import {PlatformServerless} from "@tsed/platform-serverless";
import {TimeslotsController} from "./TimeslotsController.js";

// shared configuration
const config = {
  envs: process.env,
  lambda: [TimeslotsController],
  imports: [
    {
      token: TimeslotsRepository,
      useClass: DynamoDBTimeslotsRepository
    }
  ]
};

const platform = PlatformServerless.bootstrap(config);

export const timeslots = platform.handler();
```

When you use the `PlatformServerless.bootstrap` method, Ts.ED expose an `handler`
that handle all request to the appropriate controller methods based on the request path.

To allow that, you have to configure AWS API Gateway to route all requests to the same lambda.

- using terraform: https://github.com/tsedio/tsed-aws-lambda/blob/main/packages/lambda/terraform/gateway.tf
- using serverless: https://github.com/tsedio/tsed-example-aws/blob/master/simple-proxy-api.yaml

## Get AwsContext and AwsEvent

Ts.ED provides a `ServerlessContext` abstraction to access the AWS Context and AWS Event.

Here an example to access the AWS Context and AWS Event:

```typescript
import {Controller} from "@tsed/di";
import {QueryParams, Context} from "@tsed/platform-params"; // /!\ don't import decorators from @tsed/common
import {ServerlessContext} from "@tsed/platform-serverless";
import type {APIGatewayProxyEventV2} from "aws-lambda";

@Controller()
export class TimeslotsController {
  get(@Context() $ctx: ServerlessContext) {
    console.log($ctx.context); // AWS Context
    console.log($ctx.event); // AWS Event
    console.log($ctx.getEvent<APIGatewayProxyEventV2>()); // AWS Event with the correct typings
    console.log($ctx.response); // Response Platform abstraction layer
    console.log($ctx.request); // Request Platform abstraction layer

    $ctx.response.setHeader("x-test", "test");

    return {};
  }
}
```

## Lambda Authorizer

A Lambda authorizer is a Lambda function that you provide to control access to your API. It's a good way to implement a
custom authorization scheme.

> Source: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html

To implement a lambda authorizer you have to create a handler as follows:

```ts
import "@tsed/ajv"; // enable validation

import {LambdaAuthorizerController} from "@project/controllers/LambdaAuthorizerController.js";
import {PlatformServerless} from "@tsed/platform-serverless";

// shared configuration
const config = {
  envs: process.env,
  auth: {}
};

export const authorizer = PlatformServerless.callback(LambdaAuthorizerController, "authorizer", config);
```

Then create a new controller to process the Lambda Auth event.

```ts
import {JwtService} from "@project/infra/auth/services/JwtService.js";
import {AwsPolicyService} from "@project/infra/aws/auth/AwsPolicyService.js";
import {Controller, Inject} from "@tsed/di";
import {Context} from "@tsed/platform-params";
import {ServerlessContext} from "@tsed/platform-serverless";
import {Description, Get} from "@tsed/schema";
import type {APIGatewayTokenAuthorizerEvent} from "aws-lambda";

export type AuthorizeServerlessContext = ServerlessContext<APIGatewayTokenAuthorizerEvent>;

@Controller("/")
export class LambdaAuthorizerController {
  @Inject()
  protected awsPolicyService: AwsPolicyService;

  @Inject()
  protected jwtService: JwtService;

  @Get("/authorizer")
  @Description("this endpoint is used to authorize the request using Lambda aws")
  async authorizer(@Context() $ctx: AuthorizeServerlessContext) {
    const decodedToken = await this.jwtService.decode($ctx.event.authorizationToken.replace("Bearer ", ""));
    const {user} = decodedToken.payload;

    // example on how to manage auth and format the response depending on the user scope
    if (!user.scopes.includes("api")) {
      // not allowed to consume API
      return $ctx.response.status(401).body(this.awsPolicyService.generateDeny("me", $ctx.event.methodArn));
    }

    if (user.scopes.includes("timeslots")) {
      // allowed to consume timeslots
      return this.awsPolicyService.generateAllow("me", $ctx.event.methodArn, {
        user
      });
    }

    // no API resource allowed
    return this.awsPolicyService.generateDeny("me", $ctx.event.methodArn);
  }
}
```

In this example we implement an authentication strategy to consume the JWT token. The `jwtService`
validate/decode the token and extract the scopes. Then we return a policy to allow or deny the request.

::: warning
Note here, the example use a `TOKEN` event type. This is why we use `APIGatewayTokenAuthorizerEvent` interface to enable the correct
type checking. If you use a `REQUEST` event type use the appropriate interface.
:::

Let's see the AwsPolicyService:

```ts
import {UserInfo} from "@project/domain/users/UserInfo.js";
import {Injectable} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";

export interface AwsAuthResponse {
  principalId: string;
  policyDocument?: {
    Version: string;
    Statement: {
      Action: string;
      Effect: string;
      Resource: string;
    }[];
  };
  context: {
    user?: UserInfo;
  };
}

@Injectable()
export class AwsPolicyService {
  // Help function to generate an IAM policy
  generatePolicy(principalId: string, effect: string, resource: string, context: AwsAuthResponse["context"]): AwsAuthResponse {
    // Required output:
    const authResponse: AwsAuthResponse = {
      principalId,
      // Optional output with custom properties of the String, Number or Boolean type.
      context: {
        ...context,
        user: serialize(context.user)
      }
    };

    if (effect && resource) {
      authResponse.policyDocument = {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: resource
          }
        ]
      };
    }

    return authResponse;
  }

  generateAllow(principalId: string, resource: string, context: AwsAuthResponse["context"]) {
    return this.generatePolicy(principalId, "Allow", resource, context);
  }

  generateDeny(principalId: string, resource: string, context: AwsAuthResponse["context"] = {}) {
    return this.generatePolicy(principalId, "Deny", resource, context);
  }
}
```

The most important part is the `generatePolicy` method that generates the policy response for the AWS Lambda Authorizer.

This payload will be used by the AWS API Gateway to allow or deny the request and will be forwarded to the
protected lambda.

Here is an example to retrieve the auth context in your lambda:

```typescript
import {Controller} from "@tsed/di";
import {Context} from "@tsed/platform-params";
import {ServerlessContext} from "@tsed/platform-serverless";

@Controller()
export class TimeslotsController {
  get(@Context() $ctx: ServerlessContext) {
    console.log($ctx.event.authorizer.user); // Show user info serialized by the AwsPolicyService

    return {};
  }
}
```

## Stream response

AWS support streaming response. To enable this feature, you have to configure your lambda to return a stream response
(see the [AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/configuration-response-streaming.html))
and configure your controller method to tell Ts.ED to generate handler for streaming response.

Here an example to stream a response:

```typescript
import {Controller} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {ServerlessContext} from "@tsed/platform-serverless";

@Controller()
class StreamLambda {
  @Post("/scenario-1/:id")
  @(Returns(200, String).Binary())
  scenario1(@BodyParams("id") id: string) {
    return Readable.from(
      Buffer.from(
        JSON.stringify({
          id: "HELLO"
        })
      )
    );
  }
}
```

::: tip
`.Binary()` is used to tell Ts.ED to stream the response.
:::

Here is also an example to test your code:

```ts
describe("Stream", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [StreamLambda]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe("scenario1: Post lambda with body and handle response", () => {
    it("should return data", async () => {
      const response = await PlatformServerlessTest.request.call("scenario1").post("/").body({
        id: "1",
        name: "Test"
      });

      expect(response).toEqual({
        body: '{"id":"HELLO"}',
        headers: {
          "content-type": "application/octet-stream",
          "x-request-id": "requestId"
        },
        statusCode: 200
      });
    });
  });
});
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

    it("should call getById Lambda", async () => {
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
