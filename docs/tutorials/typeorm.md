---
meta:
 - name: description
   content: Use TypeORM with Express, TypeScript and Ts.ED. ORM for TypeScript and JavaScript (ES7, ES6, ES5). Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, WebSQL databases. Works in NodeJS, Browser, Ionic, Cordova and Electron platforms.
 - name: keywords
   content: ts.ed express typescript typeorm node.js javascript decorators
---
# TypeORM
<Badge text="beta" type="warn"/> <Badge text="Contributors are welcome" />

<Banner src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" href="https://typeorm.io/" height="128" />

This tutorial provide two way to create connection:

- The first one use @tsed/typeorm module to creation multiple connections with @@ServerSettings@@,
- The seconds use the new async provider feature introduced in v5.27 to create connection.

Additionally, this topic show you how you can use Entity from Typeorm with Ts.ED controller (on bottom of this page).

## Solution with @tsed/typeorm

::: tip
You can find a working example on [TypeORM here](https://github.com/TypedProject/tsed-example-typeorm).
:::

### Feature

Currently, `@tsed/typeorm` allows you:

- Configure one or more TypeORM connections via the `@ServerSettings` configuration. All databases will be initialized when the server starts during the server's `OnInit` phase.
- Use the Entity TypeORM as Model for Controllers, AJV Validation and Swagger.

### Installation

To begin, install the TypeORM module for TS.ED:
```bash
npm install --save @tsed/typeorm
```

Then import `@tsed/typeorm` in your @@ServerLoader@@:

<<< @/docs/tutorials/snippets/typeorm/typeorm-configuration.ts

### TypeORMService

TypeORMService let you to retrieve an instance of TypeORM Connection.

<<< @/docs/tutorials/snippets/typeorm/typeorm-usage.ts

For more information about TypeORM look his documentation [here](https://github.com/typeorm/typeorm);

## Solution with Async provider

This solution let you manage your connection and create provider around this with `useAsyncFactory` feature (See [custom providers](/docs/custom-provider.md)) 

::: warning
`@tsed/typeorm` must not installed on your project but you have to install `typeorm` npm module instead.
:::

### Declare you connection as provider

<<< @/docs/tutorials/snippets/typeorm/typeorm-async-provider.ts

### Inject connection in another service

<<< @/docs/tutorials/snippets/typeorm/typeorm-injection-async-provider.ts

### Configure your connection

<<< @/docs/tutorials/snippets/typeorm/typeorm-custom-configuration.ts

## Use Entity TypeORM with Controller

We need to define an Entity TypeORM like this and use Ts.ED Decorator to define the JSON Schema.

<<< @/docs/tutorials/snippets/typeorm/typeorm-entity.ts

Now, the model is correctly defined and can be used with a [Controller](/docs/controllers.md), [AJV validation](/tutorials/ajv.md),
[Swagger](/tutorials/swagger.md) and [TypeORM](https://github.com/typeorm/typeorm).

We can use this model with a Controller like that:

<<< @/docs/tutorials/snippets/typeorm/typeorm-entity-controller.ts


