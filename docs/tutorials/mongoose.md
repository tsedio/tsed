---
meta:
 - name: description
   content: Use Mongoose with Express, TypeScript and Ts.ED. Mongoose provides a straight-forward, schema-based solution to model your application data.
 - name: keywords
   content: ts.ed express typescript mongoose node.js javascript decorators
---
# Mongoose <Badge text="Contributors are welcome" />

<Banner src="http://mongodb-tools.com/img/mongoose.png" height="128" href="http://mongoosejs.com/"></Banner>

This tutorials show you, how you can use mongoose package with Ts.ED. 

## Feature

Currently, `@tsed/mongoose` allows you:
 
- Configure one or more MongoDB database connections via the `@ServerSettings` configuration. 
All databases will be initialized when the server starts during the server's `OnInit` phase.
- Declare a Model from a class with annotation,
- Add a plugin, PreHook method and PostHook on your model.
- Inject a Model to a Service, Controller, Middleware, etc...

::: tip Note
`@tsed/mongoose` use the JsonSchema and his decorators to generate the mongoose schema.
:::

## Installation

Before using the `@tsed/mongoose` package, we need to install the [mongoose](https://www.npmjs.com/package/mongoose) module.

```bash
npm install --save mongoose
npm install --save @tsed/mongoose
```

Then import `@tsed/mongoose` in your [ServerLoader](/api/common/server/components/ServerLoader.md):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/mongoose"; // import mongoose ts.ed module

@ServerSettings({
  mongoose: {
    url: "mongodb://127.0.0.1:27017/db1",
    connectionOptions: {}
  }
})
export class Server extends ServerLoader {

}
```

## MongooseService

@@MongooseService@@ let you to retrieve an instance of Mongoose.Connection. 

```typescript
import {Service} from "@tsed/common";
import {MongooseService} from "@tsed/mongoose";

@Service()
export class MyService {
  constructor(mongooseService: MongooseService) {
    mongooseService.get(); // return mongoose connection instance
  }
}
```

## API

Ts.ED give some decorators and service to write your code:

<ApiList query="labels.indexOf('mongoose') > -1 || module === '@tsed/mongoose' && symbolType === 'decorator'" />

## Declaring a mongoose object (schema or model)
### Declaring a Model

`@tsed/mongoose` works with models which must be explicitly declared.

<<< @/docs/tutorials/snippets/mongoose/declaring-model.ts

### Declaring a Schema

`@tsed/mongoose` supports subdocuments which must be explicitly declared.

<<< @/docs/tutorials/snippets/mongoose/declaring-schema.ts

### Declaring Properties

By default, `@tsed/mongoose` reuse the metadata stored by the decorators dedicated
to describe a JsonSchema. These decorators come from the `@tsed/common` package.

<<< @/docs/tutorials/snippets/mongoose/example-model-mongoose.ts

::: tip
Isn't necessary to use @@Property@@ decorator on property when you use one of theses decorators:

<ApiList query="(status.indexOf('jsonschema') > -1 || status.indexOf('mongoose') > -1 && status.indexOf('property') > -1) && status.indexOf('decorator') > -1" />

Theses decorators call automatically @@Property@@ decorator.
:::

### Collections

Mongoose and `@tsed/mongoose` supports both list and map. 

<<< @/docs/tutorials/snippets/mongoose/collections.ts

### Subdocuments

`@tsed/mongoose` supports `mongoose` subdocuments as long as they are defined schema. Therefore, subdocuments must be decorated by `@Schema()`.

<<< @/docs/tutorials/snippets/mongoose/subdocuments.ts

### References

`@tsed/mongoose` supports `mongoose` references between defined models.

<<< @/docs/tutorials/snippets/mongoose/references.ts

### Virtual References

`@tsed/mongoose` supports `mongoose` virtual references between defined models.

Be wary of circular dependencies. Direct references must be declared after the refered class has been declared. This mean the virtual reference cannot know the refered class directly at runtime. Type definitions removed at transpilation are fine.

<<< @/docs/tutorials/snippets/mongoose/virtual-references.ts

### Dynamic References

`@tsed/mongoose` supports `mongoose` dynamic references between defined models.

This works by having a field with the referenced object model's name and a field with the referenced field.

<<< @/docs/tutorials/snippets/mongoose/dynamic-references.ts

## Register hook

Mongoose allows the developer to add pre and post [hooks / middlewares](http://mongoosejs.com/docs/middleware.html) to the schema. 
With this it is possible to add document transformations and observations before or after validation, save and more.

Ts.ED provide class decorator to register middlewares on the pre and post hook.

### Pre hook

We can simply attach a @@PreHook@@ decorator to your model class and
 define the hook function like you normally would in Mongoose.
 
<<< @/docs/tutorials/snippets/mongoose/pre-hook.ts

This will execute the pre-save hook each time a `CarModel` document is saved. 

### Post hook

We can simply attach a @@PostHook@@ decorator to your model class and
 define the hook function like you normally would in Mongoose.
 
<<< @/docs/tutorials/snippets/mongoose/post-hook.ts

This will execute the post-save hook each time a `CarModel` document is saved. 

## Plugin

Using the @@Plugin@@ decorator enables the developer to attach various Mongoose plugins to the schema. 
Just like the regular `schema.plugin()` call, the decorator accepts 1 or 2 parameters: the plugin itself, and an optional configuration object. 
Multiple `plugin` decorator can be used for a single model class.

<<< @/docs/tutorials/snippets/mongoose/plugin.ts

## Inject model

It's possible to inject a model into a Service (or Controller, Middleware, etc...):

<<< @/docs/tutorials/snippets/mongoose/inject-model.ts

::: tip
You can find a working example on [Mongoose here](https://github.com/TypedProject/tsed-example-mongoose).
:::
