---
meta:
  - name: description
    content: Use Mongoose with Express, TypeScript and Ts.ED. Mongoose provides a straight-forward, schema-based solution to model your application data.
  - name: keywords
    content: ts.ed express typescript mongoose node.js javascript decorators
projects:
  - title: Kit Mongoose
    href: https://github.com/tsedio/tsed-example-mongoose
    src: /mongoose.png
---

# Mongoose

<Banner src="/mongoose.png" height="200" href="http://mongoosejs.com/"></Banner>

This tutorial shows you how you can use mongoose package with Ts.ED.

<Projects type="projects"/>

## Features

Currently, [`@tsed/mongoose`](https://www.npmjs.com/package/@tsed/mongoose) allows you to:

- Configure one or more MongoDB database connections via the `@ServerSettings` configuration.
  All databases will be initialized when the server starts during the server's `OnInit` phase.
- Declare a Model from a class with annotation,
- Declare inhertitated models in a single collection via `@DiscriminatorKey`
- Add a plugin, PreHook method and PostHook on your model
- Inject a Model to a Service, Controller, Middleware, etc.
- Create and manage multiple connections

::: tip Note
`@tsed/mongoose` uses the JsonSchema and its decorators to generate the mongoose schema.
:::

## Installation

Before using the `@tsed/mongoose` package, we need to install the [mongoose](https://www.npmjs.com/package/mongoose) module.

```bash
npm install --save mongoose
npm install --save @tsed/mongoose
npm install --save-dev @tsed/testing-mongoose
```

::: warning
Since mongoose v5.11.0, the module expose his own file definition and can broke your build!
To solve it, install @tsed/mongoose v6.14.1 and remove the `@types/mongoose` dependencies.
:::

Then import `@tsed/mongoose` in your [Configuration](/docs/configuration.md):

<Tabs class="-code">
  <Tab label="Configuration" icon="bx-code-alt">
  
<<< @/tutorials/snippets/mongoose/configuration.ts

  </Tab>
  </Tab>
  <Tab label="CodeSandbox" icon="bxl-codepen">
<iframe src="https://codesandbox.io/embed/tsed-mongoose-example-omkbm?fontsize=14&hidenavigation=1&theme=dark" 
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" 
     title="tsed-mongoose-example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>
  </Tab>
</Tabs>
     
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

## Decorators

Ts.ED gives some decorators and services to write your code:

<ApiList query="status.includes('decorator') && status.includes('mongoose')" />

You can also use the common decorators to describe model (See [models](/docs/model.html) documentation):

<ApiList query="status.includes('decorator') && status.includes('schema')" />

## Declaring a Mongoose object (schema or model)

### Declaring a Model

`@tsed/mongoose` works with models which must be explicitly declared.

<<< @/tutorials/snippets/mongoose/declaring-model.ts

### Declaring a Model to a specific connection

<<< @/tutorials/snippets/mongoose/declaring-model-connection.ts

### Declaring a Schema

`@tsed/mongoose` supports subdocuments which must be explicitly declared.

<<< @/tutorials/snippets/mongoose/declaring-schema.ts

::: tip
Schema decorator accepts a second parameter to configure the Schema (See [Mongoose Schema](https://mongoosejs.com/docs/guide.html#options))
:::

### Declaring Properties

By default, `@tsed/mongoose` reuses the metadata stored by the decorators dedicated
to describe a JsonSchema. These decorators come from the `@tsed/common` package.

<<< @/tutorials/snippets/mongoose/example-model-mongoose.ts

::: tip
It isn't necessary to use @@Property@@ decorator on property when you use one of these decorators:

<ApiList query="(status.indexOf('jsonschema') > -1 || status.indexOf('mongoose') > -1 && status.indexOf('property') > -1) && status.indexOf('decorator') > -1" />

These decorators call automatically the @@Property@@ decorator.
:::

### Collections

Mongoose and `@tsed/mongoose` support both lists and maps.

<<< @/tutorials/snippets/mongoose/collections.ts

### Subdocuments

`@tsed/mongoose` supports `mongoose` subdocuments as long as they are defined schemas. Therefore, subdocuments must be decorated by `@Schema()`.

<<< @/tutorials/snippets/mongoose/subdocuments.ts

### References

`@tsed/mongoose` supports `mongoose` references between defined models.

<<< @/tutorials/snippets/mongoose/references.ts

### Circular References

`@tsed/mongoose` supports `mongoose` circular references between defined models.
When you have models that either both refer to each other, or refer to themselves there is a slightly different way to declare this inside those models.

In this example a **Customer** has many **Contracts** and each **Contract** has a reference back to the **Customer**. This is declared using an arrow function.

```
() => ModelName
```

<<< @/tutorials/snippets/mongoose/extended-circular-reference.ts

### Virtual References

`@tsed/mongoose` supports `mongoose` virtual references between defined models.

The same rules for Circular References apply (**See above**);

<<< @/tutorials/snippets/mongoose/virtual-references.ts

### Dynamic References

`@tsed/mongoose` supports `mongoose` dynamic references between defined models.

This works by having a field with the referenced object model's name and a field with the referenced field.

<<< @/tutorials/snippets/mongoose/dynamic-references.ts

### Decimal Numbers

`@tsed/mongoose` supports `mongoose` 128-bit decimal floating points data type [Decimal128](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-Decimal128).

The @@NumberDecimal@@ decorator is used to set Decimal128 type for number fields.

<<< @/tutorials/snippets/mongoose/decimal-numbers.ts

Optionally a custom decimal type implementation, such as [big.js](https://www.npmjs.com/package/big.js), can be used by passing a constructor to the field decorator.

<<< @/tutorials/snippets/mongoose/extended-decimal-numbers.ts

## Register hook

Mongoose allows the developer to add pre and post [hooks / middlewares](http://mongoosejs.com/docs/middleware.html) to the schema.
With this it is possible to add document transformations and observations before or after validation, save and more.

Ts.ED provides class decorator to register middlewares on the pre and post hook.

### Pre hook

We can simply attach a @@PreHook@@ decorator to the model class and
define the hook function like we would normally do in Mongoose.

<<< @/tutorials/snippets/mongoose/pre-hook.ts

This will execute the pre-save hook each time a `CarModel` document is saved.

### Post hook

We can simply attach a @@PostHook@@ decorator to the model class and
define the hook function like we would normally do in Mongoose.

<<< @/tutorials/snippets/mongoose/post-hook.ts

This will execute the post-save hook each time a `CarModel` document is saved.

## Plugin

Using the @@Plugin@@ decorator enables the developer to attach various Mongoose plugins to the schema.
Just like the regular `schema.plugin()` call, the decorator accepts 1 or 2 parameters: the plugin itself, and an optional configuration object.
Multiple `plugin` decorator can be used for a single model class.

<<< @/tutorials/snippets/mongoose/plugin.ts

## Discriminators

Set the `@DiscriminatorKey` decorator on a property in the parent class to define the name of the field for the discriminator value.

Extend the child model classes from the parent class. By default the value for the discriminator field is the class name but it can be overwritten via the `discriminatorValue` option on the model.

<<< @/tutorials/snippets/mongoose/discriminator.ts

::: tip
For further information, please refer to the [mongoose documentation about discriminators](https://mongoosejs.com/docs/discriminators.html).
:::

## Document Versioning

Set the `@VersionKey` decorator on a `number` property to define the name of the field used for versioning and optimistic concurrency.

<<< @/tutorials/snippets/mongoose/version-key.ts

::: tip
For further information, please refer to the [mongoose documentation about the versionKey option](https://mongoosejs.com/docs/guide.html#versionKey).
:::

## Inject model

It's possible to inject a model into a Service (or Controller, Middleware, etc...):

<<< @/tutorials/snippets/mongoose/inject-model.ts

::: tip
You can find a working example on [Mongoose here](https://github.com/tsedio/tsed-example-mongoose).
:::

### Caveat <Badge text="v6.14.4" />

Mongoose doesn't return a real instance of your class. If you inspected the returned item by one of mongoose's methods,
you'll see that the instance is as Model type instead of the expected class:

```typescript
import {Inject, Injectable} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {Product} from "./models/Product";

@Injectable()
export class MyRepository {
  @Inject(Product)
  private model: MongooseModel<Product>;

  async find(query: any) {
    const list = await this.model.find(query).exec();

    console.log(list[0]); // Model { Product }

    return list;
  }
}
```

There is no proper solution currently to have the expected instance without transforming the current instance to
the class with the @@deserialize@@ function.

To simplify this, Ts.ED adds a `toClass` method to the MongooseModel to find, if necessary, an instance of type Product.

```typescript
import {Inject, Injectable} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {Product} from "./models/Product";

@Injectable()
export class MyRepository {
  @Inject(Product)
  private model: MongooseModel<Product>;

  async find(query: any) {
    const list = await this.model.find(query).exec();

    console.log(list[0]); // Model { Product }
    console.log(list[0].toClass()); // Product {}

    return list;
  }
}
```

## Testing <Badge text="beta" type="warn"/>

The package [`@tsed/testing-mongoose`](https://www.npmjs.com/package/@tsed/testing-mongoose) allows you to test your server with a memory database.

::: tip
This package uses the amazing [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server) to mock the mongo database.
:::

### Testing API

This example shows you how you can test your Rest API with superagent and a mocked Mongo database:

<Tabs class="-code">
<Tab label="Jest">

<<< @/tutorials/snippets/mongoose/testing-api.jest.ts

</Tab>
<Tab label="Mocha">

<<< @/tutorials/snippets/mongoose/testing-api.mocha.ts

</Tab>
</Tabs>

::: tip
To increase mocha timeout from 2000ms to 10000ms use option `--timeout 10000`.
:::

### Jest additional setup

Add a script to close connection after all unit test. In your jest configuration file add the following line:

```json
{
  "globalTeardown": "./scripts/jest/teardown.js"
}
```

And create the script with the following content:

```js
module.exports = async () => {
  (await global.__MONGOD__) && global.__MONGOD__.stop();
};
```

### Testing Model

This example shows you how can test the model:

<Tabs class="-code">
<Tab label="Jest">

<<< @/tutorials/snippets/mongoose/testing-model.jest.ts

</Tab>
<Tab label="Mocha">

<<< @/tutorials/snippets/mongoose/testing-model.mocha.ts

</Tab>
</Tabs>

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
