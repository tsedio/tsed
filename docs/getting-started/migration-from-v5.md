---
prev: /docs/configuration.md
next: /docs/controllers.html
otherTopics: true
meta:
  - name: description
    content: Migrate Ts.ED application from v5 to v6. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: migration getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Migrate from v5

## What's new ?

<ReleaseNote style="max-height: 500px" class="overflow-auto mb-5" />

### Platform API

V6 marks a major evolution of the Ts.ED framework.
A lot of work has been done on the internal Ts.ED code since v5 in order to prepare the arrival of this new version.
This work was mainly oriented on the creation of an abstraction layer between the Ts.ED framework and Express.js.

The v5 introduced the [Platform API](/docs/platform-api.md)
and the v6 is the confirmation of this API which allows supporting [Express.js](https://expressjs.com/) and [Koa.js](https://koajs.com/) and many more in the future.

We are glad this work resulted in the creation of the [@tsed/platform-express](/https://www.npmjs.com/package/@tsed/platform-express) and
[@tsed/platform-koa](/https://www.npmjs.com/package/@tsed/platform-koa).

::: tip See also

- Template engine: [Configure template engine with Platform API](/docs/templating.md).
- Statics files: [Configure statics files with Platform API](/docs/serve-files.md).
- Upload files: [Multer is now a part of @tsed/common](/docs/serve-files.md).

:::

### Schema and OpenSpec

This release finally adds support for [OpenSpec 3](https://swagger.io/docs/specification/about/) while supporting
the previous version [Swagger2](https://swagger.io/docs/specification/2-0/basic-structure/).
The management of OpenSpec is at the heart of the framework as is [JsonSchema](https://json-schema.org/).

All decorators related to the declaration of schema, routes and endpoints are now integrated in a single module [`@tsed/schema`](https://www.npmjs.com/package/@tsed/schema).
This module has been designed to be used independently of the Ts.ED framework.
You can therefore use it for your projects without installing the whole framework!

::: tip See also
New features are available:

- [Manage models using Typescript generics](/docs/controllers.md#generics).
- [Add validation decorator on endpoint parameters](/docs/controllers.md#validation).
- [Manage response models by content-type and status code (OAS3)](/tutorials/swagger.md).
- [Configure swagger to generate OpenSpec3](/tutorials/swagger.md).

:::

::: warning
These decorators have moved from `@tsed/common`/`@tsed/swagger` to `@tsed/schema`:

<ApiList query="['Status', 'Header', 'ContentType', 'Returns'].includes(symbolName) || module === '@tsed/schema' && status.includes('decorator') && status.includes('schema')" />
:::

### JsonMapper

In the same idea, the convertersService code was taken out of the [`@tsed/common`](https://www.npmjs.com/package/@tsed/common) module
to the new [`@tsed/json-mapper`](https://www.npmjs.com/package/@tsed/json-mapper) module.
It's based on the [`@tsed/schema`](https://www.npmjs.com/package/@tsed/schema) module to perform the mapping of your classes
to a Plain Object JavaScript object and vice versa.

You can therefore use it for your projects without installing the whole framework!

::: tip See also

- @@Ignore@@ decorator accepts a callback to define when the property should be ignored.
- @@serialize@@ and @@deserialize@@ function can be used in place of @@ConverterService@@.
- `@Converter` has been replaced in favor of @@JsonMapper@@.

:::

### Cache

Ts.ED provide now, a unified cache manager solution based on the awesome [`cache-manager`](https://www.npmjs.com/package/cache-manager).

See our dedicated page on [Cache](/docs/cache.md).

## Breaking changes

### Api & Features

- `ServerLoader` API has been removed in favor of Platform API. See [Platform API](/docs/platform-api.md).
- `Filter` feature has been removed in favor of [Pipes](/docs/pipes.md).
- `GlobalErrorHandlerMiddleware` has been removed in favor of [Exception Filters](/docs/exceptions.md#exception-filter).
- @@ConverterService@@ doesn't perform data validation. Validation is performed by [`@tsed/ajv`](/tutorials/ajv.md) package or any other validation library.

### Modules

The following modules have been removed:

- `@tsed/testing`: Use @@PlatformTest@@ from `@tsed/common`.
- `@tsed/multipartfiles`: Use @@MultipartFile@@ from `@tsed/common`.
- `ts-express-decorators`: Use `@tsed/common`.

### Decorators

The following decorators have been removed:

#### @tsed/di

- `@OverrideService`: Use @@OverrideProvider@@

#### @tsed/common

- `@ServerSettings`: Use @@Configuration@@.
- `@ExpressApplication`: Use @@PlatformApplication@@ instead.
- `@ExpressRouter`: Use @@PlatformRouter@@ instead.
- `@ResponseView`: Use @@View@@ decorator instead.
- `@Filter`: Filter feature has been removed.
- `@MiddlewareError`: Use @@Middleware@@.
- `@Converter`: @Converter is replaced by @@JsonMapper@@ from `@tsed/json-mapper`.
- `PropertyDeserialize` and `PropertySerialize` have been removed and replaced by @@OnDeserialize@@ and @@OnSerialize@@ from `@tsed/json-mapper`.

#### @tsed/typeorm

- `@EntityRepository`: Use EntityRepository from `typeorm` directly.

#### @tsed/swagger

Import the following decorators from `@tsed/schema`:

<ApiList query="['Consumes', 'Deprecated', 'Description', 'Example', 'Name', 'Produces', 'Returns','Security', 'Summary', 'Title'].includes(symbolName)" />

- `@BaseParameter` has been removed.
- `@Operation` has been removed.
- `@Responses` has been removed.
- `@ReturnsArray` has been removed. Use @@Returns@@ from `@tsed/schema`.

### Classes

#### @tsed/common

- Classes like `ArrayConverter`, `SetConverter`, etc. are replaced by their equivalents @@ArrayMapper@@, @@SetMapper@@, etc. These classes cannot be injected to another provider.

## Migration guide

### ServerLoader to Platform API

All changes related to [Platform API](/docs/platform-api.md) and how to migrate the Server on this new API, are described on a dedicated page.
We encourage you to browse the entire page to migrate from v4/v5 to v6.

See our [Platform API](/docs/platform-api.md) documentation page.

### Inject service in the Server

With the `ServerLoader` API in v4/5, injecting a provider can be done as follows:

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import {MyService} from "./services/MyService";

@ServerLoader({})
export class Server extends ServerLoader {
  $beforeRoutesInit() {
    const myService = this.injector.get<MyService>(MyService);

    myService.getSomething();
  }
}
```

Now Platform API, the Server class is considered as a @@Provider@@.
It means that you can use decorator like @@Constant@@ and @@Inject@@ to get any configuration, provider or service from the DI registry.

```typescript
import {Configuration} from "@tsed/common";
import {Inject} from "@tsed/di";
import {MyService} from "./services/MyService";

@Configuration({})
export class Server {
  @Inject()
  myService: MyService;

  $beforeRoutesInit() {
    this.myService.getSomething();
  }
}
```

### SendResponseMiddleware & PlatformResponseMiddleware to ResponseFilter

::: warning Breaking changes

- SendResponseMiddleware has been removed.
- PlatformResponseMiddleware has been removed.
  :::

To reach cross compatibility and performance with Express.js and Koa.js, the SendResponseMiddleware (aka PlatformResponseMiddleware in latest v5 version) has been removed.

Now, when a request is sent to the server all middlewares added in the Server, [Controller](/docs/controllers.md) or Endpoint with decorators
will be called while a response isn't sent by one of the handlers/middlewares in the stack.

<figure><img src="./../assets/middleware-in-sequence.svg" style="max-width:400px; padding:30px"></figure>

For each executed endpoints and middlewares, Platform API stores the return value to the @@Context@@. We have two scenarios:

1. If data is stored in the @@Context@@ object, the response will be immediately sent to your consumer after the UseAfterEach middleware (if present).
2. If no data is stored in the @@Context@@ object, the call sequence middlewares continue to the next endpoint (if present) or to the UseAfter then Global middlewares until data is returned by a handler.

By removing this middleware, it isn't possible for the v5 application to override the middleware and change the response format before sending it to the consumer.

The [Response Filter](/docs/response-filter.md), implemented in v6.1.0, allows this possibility again but in a more elegant way by using the `@ResponseFilter` decorator and a class.

<Tabs class="-code">
<Tab label="WrapperResponseFilter.ts" icon="bx-code-alt">

```typescript
import {ResponseFilter, Context, ResponseFilterMethods} from "@tsed/common";

@ResponseFilter("application/json")
export class WrapperResponseFilter implements ResponseFilterMethods {
  transform(data: any, ctx: Context) {
    return {data, errors: [], links: []};
  }
}
```

</Tab>
<Tab label="UserCtrl.ts" icon="bx-code-alt">

```typescript
import {Configuration} from "@tsed/common";
import {Returns} from "@tsed/schema";

@Controller("/users")
export class UsersCtrl {
  @Get("/:id")
  @Returns(200, User).ContentType("application/json")
  @Returns(200, String).ContentType("text/xml")
  async getUser(@PathParams("id") id: string) {
    return new User({id});
  }
}
```

</Tab>
<Tab label="Server.ts" icon="bxs-server">

```typescript
import {Configuration} from "@tsed/common";
import {WrapperResponseFilter} from "./filters/WrapperResponseFilter";

@Configuration({
  responseFilters: [
    WrapperResponseFilter
  ]
})
```

</Tab>
<Tab label="UsersCtrl.spec.ts" icon="bx-test-tube">

```typescript
import {UsersCtrl} from "@tsed/common";
import * as SuperTest from "supertest";
import {UsersCtrl} from "./UsersCtrl";
import {Server} from "../../Server";

describe("UserCtrl", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(Server, {
      mount: {
        "/rest": [UsersCtrl]
      },
      responseFilters: [XmlResponseFilter]
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);
  it("should return the wrapped data", async () => {
    const response = await request.get("/rest/users/1").expect(200);

    expect(response.body).toEqual({data: {id: "1"}, errors: [], links: []});
  });
});
```

</Tab>
</Tabs>

::: warning
The wrapper won't be documented in your generated `swagger.json`!
:::

::: tip
See all possibilities of this new feature on its dedicated page [Response Filter](/docs/response-filter.md).
:::

### GlobalErrorHandler to Exception Filter

::: warning Breaking changes

- CustomGlobalErrorHandlerMiddleware has been removed.
- Default [Exception Filter](/docs/exceptions.html#exception-filter) returns a Json object to your consumer.

:::

To fix that, remove the line where you add you custom middleware in the server:

```typescript
class Server {
  $afterRoutesInit() {
    this.app.use(CustomGlobalErrorHandlerMiddleware); // remove this
  }
}
```

::: tip
To migrate your `CustomGlobalErrorHandlerMiddleware` to create an exception filter, see our [Exception Filter](/docs/exceptions.html#exception-filter) documentation page to know what is the appropriate implementation
for your usecase.
:::

Exception Filter uses the @@Catch@@ decorator to catch a specific instance error. For example, if you want to catch an Http exception,
you have to provide the generic @@Exception@@ class to the decorator as follows:

<<< @/docs/snippets/exceptions/http-exception-filter.ts

### Converter to JsonMapper

The `@tsed/json-mapper` package is now responsible to map a plain object to a model and a model to a plain object.

It provides two functions @@serialize@@ and @@deserialize@@ to transform objects depending on which operation you want to perform.
It uses all decorators from `@tsed/schema` package and TypeScript metadata to work.

::: warning Breaking changes

- The `@Converter` decorator has been removed in favor of @@JsonMapper@@ decorator.
- Classes like `ArrayConverter`, `SetConverter`, etc. are replaced by their equivalents Types mapper: @@ArrayMapper@@, @@SetMapper@@, etc.
- Type mapper classes are no longer injectable services.
- ConverterService is always available and can be injected to another provider, but now, ConverterService doesn't perform data validation. Validation is performed by [`@tsed/ajv`](/tutorials/ajv.md) package or any other validation library.
- `PropertyDeserialize` and `PropertySerialize` have been removed and replaced by @@OnDeserialize@@ and @@OnSerialize@@.
- Methods signatures of Type mapper (like ArrayConverter) have changed.
  :::

Here is the `ArrayConverter` as implemented in v5:

```typescript
import {Converter, IConverter, IDeserializer, ISerializer} from "@tsed/common";

@Converter(Array)
export class ArrayConverter implements IConverter {
  deserialize<T>(data: any, target: any, baseType: T, deserializer: IDeserializer): T[] {
    return [].concat(data).map((item) => deserializer!(item, baseType));
  }

  serialize(data: any[], serializer: ISerializer) {
    return [].concat(data as any).map((item) => serializer(item));
  }
}
```

Now, The new @@ArrayMapper@@ as implemented in v6:

```typescript
import {JsonMapper, JsonMapperCtx, JsonMapperMethods} from "@tsed/json-mapper";

@JsonMapper(Array)
export class ArrayMapper implements JsonMapperMethods {
  deserialize<T = any>(data: any, options: JsonMapperCtx): T[] {
    return [].concat(data).map((item) => options.next(item));
  }

  serialize(data: any[], options: JsonMapperCtx): any {
    return [].concat(data as any).map((item) => options.next(item));
  }
}
```

To help you migrate your custom mapper, here is a small table of equivalent points between v5 and v6:

| V5                      | V6                                              | Description                                                                                 |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Converter               | JsonMapper                                      | The decorator has the same behavior. You can use JsonMapper to override an existing mapper. |
| deserializer/serializer | options.next(item)                              | Call the next function to deserialize/serialize object.                                     |
| target/baseType         | JsonMapperCtx.type/JsonMapperCtx.collectionType | The types of the object and the collection.                                                 |

::: tip See also

See our [JsonMapper](/docs/converters.md#type-mapper) documentation page for details on Type mapper.

:::

### Any with BodyParams

Use `any` as type for a body parameter, will be translated as type `Object` by typescript.
It means, if you use `@tsed/ajv`, now, the validation will fail if you send a different type as expected in the payload.

<<< @/docs/snippets/controllers/params-post-any.ts

Add @@Any@@ decorator to fix the issue.

### Enum with BodyParams

Use an enum as default value for a body parameter (or query parameter), will be translated as type `Object` by typescript.
It means, if you use `@tsed/ajv`, now, the validation will fail if you send a different type as expected in the payload.

<<< @/docs/snippets/controllers/params-post-enum.ts

### Status decorator

@@Status@@ decorator from `@tsed/schema` is different from `@tsed/common`:

<Tabs class="-code">
  <Tab label="Before">

```typescript
import {Status, Controller, Get} from "@tsed/common";

@Controller("/")
class MyController {
  @Get("/")
  @Status(200, {
    type: TypeC,
    collectionType: Array,
    description: "description",
    headers: {
      "x-header": {
        type: "string"
      }
    }
  })
  get() {}
}
```

  </Tab>
  <Tab label="After">

```typescript
import {Controller, Get} from "@tsed/common";
import {Status} from "@tsed/schema";

@Controller("/")
class MyController {
  @Get("/")
  @Status(200, Array).Of(TypeC).Description("description").Header("x-header", {type: "string"})
  get() {}
}
```

  </Tab>
</Tabs>

### Returns decorator

@@Returns@@ decorator from `@tsed/schema` is different from `@tsed/common`:

<Tabs class="-code">
  <Tab label="Before">

```typescript
import {Status, Controller, Get} from "@tsed/common";

@Controller("/")
class MyController {
  @Get("/")
  @Returns(200, {
    type: TypeC,
    collectionType: Array,
    description: "description",
    headers: {
      "x-header": {
        type: "string"
      }
    }
  })
  get() {}
}
```

  </Tab>
  <Tab label="After">

```typescript
import {Controller, Get} from "@tsed/common";
import {Status} from "@tsed/schema";

@Controller("/")
class MyController {
  @Get("/")
  @Returns(200, Array).Of(TypeC).Description("description").Header("x-header", {type: "string"})
  get() {}
}
```

  </Tab>
</Tabs>

### ReturnsArray decorator

`ReturnsArray` is deprecated and will be removed in v7. You have to use @@Returns@@.

<Tabs class="-code">
  <Tab label="Before">

```typescript
import {ReturnsArray, Controller, Get} from "@tsed/common";

@Controller("/")
class MyController {
  @Get("/")
  @ReturnsArray(200, TypeC)
  get() {}
}
```

  </Tab>
  <Tab label="After">

```typescript
import {Controller, Get} from "@tsed/common";
import {Returns} from "@tsed/schema";

@Controller("/")
class MyController {
  @Get("/")
  @Returns(200, Array).Of(TypeC)
  get() {}
}
```

  </Tab>
</Tabs>
