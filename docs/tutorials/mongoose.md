---
meta:
 - name: description
   content: Use Mongoose with Express, TypeScript and Ts.ED. Mongoose provides a straight-forward, schema-based solution to model your application data.
 - name: keywords
   content: ts.ed express typescript mongoose node.js javascript decorators
projects:   
 - title: Kit Mongoose
   href: https://github.com/TypedProject/tsed-example-mongoose
   src: /mongoose.png   
---
# Mongoose <Badge text="Contributors are welcome" />

<Banner src="http://mongodb-tools.com/img/mongoose.png" height="128" href="http://mongoosejs.com/"></Banner>

This tutorial show yous how you can use mongoose package with Ts.ED. 

<Projects type="examples"/>

## Feature

Currently, [`@tsed/mongoose`](https://www.npmjs.com/package/@tsed/mongoose) allows you to:
 
- Configure one or more MongoDB database connections via the `@ServerSettings` configuration. 
All databases will be initialized when the server starts during the server's `OnInit` phase.
- Declare a Model from a class with annotation,
- Add a plugin, PreHook method and PostHook on your model
- Inject a Model to a Service, Controller, Middleware, etc.
- Create and manage multiple connections <Badge text="v5.35.0" />

::: tip Note
`@tsed/mongoose` uses the JsonSchema and its decorators to generate the mongoose schema.
:::

## Installation

Before using the `@tsed/mongoose` package, we need to install the [mongoose](https://www.npmjs.com/package/mongoose) module.

```bash
npm install --save mongoose
npm install --save @tsed/mongoose
npm install --save-dev @types/mongoose
npm install --save-dev @tsed/testing-mongoose
```

Then import `@tsed/mongoose` in your [Configuration](/docs/configuration.md):

<<< @/docs/tutorials/snippets/mongoose/configuration.ts

## MongooseService

@@MongooseService@@ lets you to retrieve an instance of Mongoose.Connection. 

```typescript
import {Service} from "@tsed/common";
import {MongooseService} from "@tsed/mongoose";

@Service()
export class MyService {
  constructor(mongooseService: MongooseService) {
    const default = mongooseService.get(); // OR mongooseService.get("default");
    // GET Other connection
    const db2 = mongooseService.get('db2');
  }
}
```

## API

Ts.ED gives some decorators and services to write your code:

<ApiList query="status.includes('decorator') && status.includes('mongoose')" />

You can also use the common decorators to describe model (See [models](/docs/model.html) documentation):

<ApiList query="status.includes('decorator') && status.includes('schema')" />

## Declaring a Mongoose object (schema or model)
### Declaring a Model

`@tsed/mongoose` works with models which must be explicitly declared.

<<< @/docs/tutorials/snippets/mongoose/declaring-model.ts

### Declaring a Model to a specific connection

<<< @/docs/tutorials/snippets/mongoose/declaring-model-connection.ts

### Declaring a Schema

`@tsed/mongoose` supports subdocuments which must be explicitly declared.

<<< @/docs/tutorials/snippets/mongoose/declaring-schema.ts

::: tip
Schema decorator accepts a second parameter to configure the Schema (See [Mongoose Schema](https://mongoosejs.com/docs/guide.html#options))
:::

### Declaring Properties

By default, `@tsed/mongoose` reuses the metadata stored by the decorators dedicated
to describe a JsonSchema. These decorators come from the `@tsed/common` package.

<<< @/docs/tutorials/snippets/mongoose/example-model-mongoose.ts

::: tip
It isn't necessary to use @@Property@@ decorator on property when you use one of these decorators:

<ApiList query="(status.indexOf('jsonschema') > -1 || status.indexOf('mongoose') > -1 && status.indexOf('property') > -1) && status.indexOf('decorator') > -1" />

These decorators call automatically the @@Property@@ decorator.
:::

### Collections

Mongoose and `@tsed/mongoose` support both lists and maps. 

<<< @/docs/tutorials/snippets/mongoose/collections.ts

### Subdocuments

`@tsed/mongoose` supports `mongoose` subdocuments as long as they are defined schemas. Therefore, subdocuments must be decorated by `@Schema()`.

<<< @/docs/tutorials/snippets/mongoose/subdocuments.ts

### References

`@tsed/mongoose` supports `mongoose` references between defined models.

<<< @/docs/tutorials/snippets/mongoose/references.ts

Be aware of circular dependencies. Direct references must be declared after the referred class has been declared. 
This means the reference cannot know the referred class directly at runtime.

<<< @/docs/tutorials/snippets/mongoose/references-circular.ts

### Virtual References

`@tsed/mongoose` supports `mongoose` virtual references between defined models.

Be aware of circular dependencies. Direct references must be declared after the referred class has been declared. 
This means the virtual reference cannot know the referred class directly at runtime.

<<< @/docs/tutorials/snippets/mongoose/virtual-references.ts

### Dynamic References

`@tsed/mongoose` supports `mongoose` dynamic references between defined models.

This works by having a field with the referenced object model's name and a field with the referenced field.

<<< @/docs/tutorials/snippets/mongoose/dynamic-references.ts

## Register hook

Mongoose allows the developer to add pre and post [hooks / middlewares](http://mongoosejs.com/docs/middleware.html) to the schema. 
With this it is possible to add document transformations and observations before or after validation, save and more.

Ts.ED provides class decorator to register middlewares on the pre and post hook.

### Pre hook

We can simply attach a @@PreHook@@ decorator to the model class and
 define the hook function like we would normally do in Mongoose.
 
<<< @/docs/tutorials/snippets/mongoose/pre-hook.ts

This will execute the pre-save hook each time a `CarModel` document is saved. 

### Post hook

We can simply attach a @@PostHook@@ decorator to the model class and
 define the hook function like we would normally do in Mongoose.
 
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

## Testing <Badge text="beta" type="warn"/> <Badge text="v5.35.0" />

The package [`@tsed/testing-mongoose`](https://www.npmjs.com/package/@tsed/testing-mongoose) allows you to test your server with a memory database. 

::: tip
This package uses the amazing [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server) to mock the mongo database.
:::

### Testing API

This example shows you how you can test your Rest API with superagent and a mocked Mongo database:

<Tabs class="-code">
<Tab label="Jest">

<<< @/docs/tutorials/snippets/mongoose/testing-api.jest.ts

</Tab>
<Tab label="Mocha">

<<< @/docs/tutorials/snippets/mongoose/testing-api.mocha.ts

</Tab>
</Tabs>


### Testing Model

This example shows you how can test the model:

<Tabs class="-code">
<Tab label="Jest">

<<< @/docs/tutorials/snippets/mongoose/testing-model.jest.ts

</Tab>
<Tab label="Mocha">

<<< @/docs/tutorials/snippets/mongoose/testing-model.mocha.ts

</Tab>
</Tabs>


<div class="sharethis-inline-share-buttons"></div>

## Author 

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="container--centered container--padded">
<a href="/contributing.html" class="nav-link button">
 Become maintainer
</a>
</div>