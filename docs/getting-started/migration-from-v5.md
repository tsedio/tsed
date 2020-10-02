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
## What's news ?
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

- Managing models using Typescript generics.
- Management response models by content-type and status code (OAS3).
- Configure swagger to generate OpenSpec3.

:::

### JsonMapper

In the same idea, the convertersService code was taken out of the [`@tsed/common`](https://www.npmjs.com/package/@tsed/common) module
 to the new [`@tsed/json-mapper`](https://www.npmjs.com/package/@tsed/json-mapper) module.
 It's based on the [`@tsed/schema`](https://www.npmjs.com/package/@tsed/schema) module to perform the mapping of your classes 
 to a Plain Object JavaScript object and vice versa.
 
You can therefore use it for your projects without installing the whole framework!

::: tip See also

- @@Ignore@@ decorator accept a callback to define when the property should be ignored!
- @@serialize@@ and @@deserialize@@ function can be used in place of @@ConverterService@@.
- `@Converter` have been replaced in favor of @@JsonMapper@@. See our [migration guide](/gettings-started/migration-from-v5.md#converter-to-jsonmapper).

:::
 
## Breaking changes
### Api & Features

- `ServerLoader` API have been remove in favor of Platform API. See [Platform API](/docs/platform-api.md).
- `Filter` feature have been removed in favor of [Pipes](/docs/pipes.md).
- `GlobalErrorHandlerMiddleware` have been.removed in favor of [Exception Filters](/docs/exceptions.md#exception-filter).
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
- `@ExpressApplication`: Use @@PlatformApplication@@ instead of.
- `@ExpressRouter`: Use @@PlatformRouter@@ instead of.
- `@ResponseView`: Use @@View@@ decorator instead of.
- `@Filter`: Filter feature have been removed.
- `@MiddlewareError`: Use @@Middleware@@.
- `@Converter`: @Converter is replaced by @@JsonMapper@@ from `@tsed/json-mapper`. See [Converter to JsonMapper](/getting-started/migration-from-v5.md#converter-to-jsonmapper) section for more details.
- `PropertyDeserialize` and `PropertySerialize` have been removed and replaced by @@OnDeserialize@@ and @@OnSerialize@@ from `@tsed/json-mapper`.

#### @tsed/typeorm

- `@EntityRepository`: Use EntityRepository from `typeorm` directly.

#### @tsed/swagger

Import the following decorators from `@tsed/schema`:

<ApiList query="['Consumes', 'Deprecated', 'Description', 'Example', 'Name', 'Produces', 'Returns','Security', 'Summary', 'Title'].includes(symbolName)" />

- `@BaseParameter` have been removed.
- `@Operation` have been removed.
- `@Responses` have been remove.
- `@ReturnsArray` have been removed. Use @@Returns@@ from `@tsed/schema`.

### Classes

#### @tsed/common

- Classes like `ArrayConverter`, `SetConverter`, etc... replaced by his equivalents @@ArrayMapper@@, @@SetMapper@@, etc... These classes cannot be injected to another provider.


## Migration guide
### ServerLoader to Platform API

All change related to [Platform API](/docs/platform-api.md) and how to migrate the Server on this new API, is described on a dedicated page.
We encourage you to browse the entire page to migrate from v4/v5 to v6.

See our [Platform API](/docs/platform-api.md) documentation page.

### Inject service in the Server

With @@ServerLoader@@, inject a provider can be done as follows:

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import {MyService} from "./services/MyService";

@ServerLoader({
})
export class Server extends ServerLoader {
  $beforeRoutesInit() {
    const myService = this.injector.get<MyService>(MyService);

    myService.getSomething();
  }
}
```

Now Platform API, the Server class is considered as a @@Provider@@. 
It means, you can use decorator like @@Constant@@ and @@Inject@@ to get any configuration, provider or service from the DI registry.

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

### GlobalErrorHandler to Exception Filter

::: warning Breaking changes

- CustomGlobalErrorHandlerMiddleware have been removed.
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
To migrate your `CustomGlobalErrorHandlerMiddleware` to create an exception filter.
See our [Exception Filter](/docs/exceptions.html#exception-filter) documentation page to know what is the appropriate implementation 
for your use case.
:::

Exception Filter use @@Catch@@ decorator to catch a specific instance error. For example, if you want to catch an Http exception
you have to provide the generic @@Exception@@ class to the decorator as follows:

<<< @/docs/docs/snippets/exceptions/http-exception-filter.ts

### Converter to JsonMapper

The `@tsed/json-mapper` package is now responsible to map a plain object to a model and a model to a plain object.

It provides two functions @@serialize@@ and @@deserialize@@ to transform object depending on which operation you want to perform.
It uses all decorators from `@tsed/schema` package and TypeScript metadata to work.

::: warning Breaking changes

- The `@Converter` decorator have been removed in favor of @@JsonMapper@@ decorator.
- Classes like `ArrayConverter`, `SetConverter`, etc... replaced by his equivalents Types mapper: @@ArrayMapper@@, @@SetMapper@@, etc... 
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

Now, The new @@ArrayMapper@@  as implemented in v6:

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

V5 | V6 | Description
---|---|---
Converter | JsonMapper | The decorator have the same behavior. You can use JsonMapper to override an existing mapper.
deserializer/serializer | options.next(item) | Call the next function to deserialize/serialize object.
target/baseType | JsonMapperCtx.type/JsonMapperCtx.collectionType | The types of the object and the collection.

::: tip See also

See our [JsonMapper](/docs/converters.md#type-mapper) documentation page for details on Type mapper.

:::