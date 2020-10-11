---
meta:
 - name: description
   content: Use TypeORM with Express, TypeScript and Ts.ED. ORM for TypeScript and JavaScript (ES7, ES6, ES5). Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, WebSQL databases. Works in NodeJS, Browser, Ionic, Cordova and Electron platforms.
 - name: keywords
   content: ts.ed express typescript typeorm node.js javascript decorators
projects:   
 - title: Kit TypeORM
   href: https://github.com/TypedProject/tsed-example-typeorm
   src: /typeorm.png
---
# TypeORM <Badge text="Contributors are welcome" />

<Banner src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" href="https://typeorm.io/" height="128" />

This tutorial provides two ways to create connection:

- The first one uses @tsed/typeorm module to create multiple connections with @@ServerSettings@@,
- The second uses the new async provider feature introduced in v5.27 to create connection.

Additionally, this topic shows you how you can use Entity from Typeorm with Ts.ED controller (on the bottom of this page).

<Projects type="typeorm"/>

### Feature

Currently, `@tsed/typeorm` allows you to:

- Configure one or more TypeORM connections via the `@ServerSettings` configuration. All databases will be initialized when the server starts during the server's `OnInit` phase.
- Use the Entity TypeORM as Model for Controllers, AJV Validation and Swagger.
- Declare a connection with asyncProvider or automatically by server configuration.

### Installation

To begin, install the TypeORM module for TS.ED:
```bash
npm install --save @tsed/typeorm
npm install --save typeorm
```

Then import `@tsed/typeorm` in your Server:

<<< @/docs/tutorials/snippets/typeorm/typeorm-configuration.ts

### TypeORMService

TypeORMService lets you retrieve an instance of TypeORM Connection.

<<< @/docs/tutorials/snippets/typeorm/typeorm-usage.ts

For more information about TypeORM, look its documentation [here](https://github.com/typeorm/typeorm);

### Declare your connection as provider

It is also possible to create your connection with the `useAsyncFactory` feature (See [custom providers](/docs/custom-provider.md))
This approach allows you to inject your connection as a Service to another one.

To create a new connection, declare your custom provider as follows:

<<< @/docs/tutorials/snippets/typeorm/typeorm-async-provider.ts

Then inject your connection to another service or provide like this:

<<< @/docs/tutorials/snippets/typeorm/typeorm-injection-async-provider.ts

## Use Entity TypeORM with Controller

We need to define an Entity TypeORM like this and use Ts.ED Decorator to define the JSON Schema.

<<< @/docs/tutorials/snippets/typeorm/typeorm-entity.ts

Now, the model is correctly defined and can be used with a [Controller](/docs/controllers.md), [AJV validation](/tutorials/ajv.md),
[Swagger](/tutorials/swagger.md) and [TypeORM](https://github.com/typeorm/typeorm).

We can use this model with a Controller like that:

<<< @/docs/tutorials/snippets/typeorm/typeorm-entity-controller.ts

## EntityRepository

You can create a custom repository which should contain methods to work with your database. 
Usually custom repositories are created for a single entity and contains its specific queries.
For example, let's say we want to have a method called `findByName(firstName: string, lastName: string)` which will search for users by a given first and last names. 
The best place for this method is in Repository, so we could call it like `userRepository.findByName(...)`. 
You can achieve this using custom repositories.

`@tsed/typeorm` plugin configures the DI so that repositories declared for TypeORM can be injected into a Ts.ED controller or service

The first way to create a custom repository is to extend Repository. Example:

<<< @/docs/tutorials/snippets/typeorm/typeorm-entity-repository.ts

Then inject your repository to another service:

<<< @/docs/tutorials/snippets/typeorm/typeorm-injection-entity-repository.ts

::: tip
Use @@UseConnection@@ decorator to select which database connection the injected repository should be used (require Ts.ED v5.58.0+).
:::

## Author 

<GithubContributors :users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors :users="['Romakita']"/>

<div class="container--centered container--padded">
<a href="/contributing.html" class="nav-link button">
 Become maintainer
</a>
</div>