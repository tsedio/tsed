<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>MikroOrm</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package of Ts.ED framework. See website: https://tsed.io/tutorials/mikro-orm

## Feature

Currently, `@tsed/mikro-orm` allows you:

- Configure one or more MikroORM instances via the `@Configuration` decorator. All databases will be initialized
  when the server starts during the server's `OnInit` phase.
- Use the Entity MikroORM as Model for Controllers, AJV Validation and Swagger.

## Installation

To begin, install the MikroORM module for TS.ED:

<Tabs class="-code">
  <Tab label="NPM">

```bash
npm install @mikro-orm/core @tsed/mikro-orm @mikro-orm/mongodb     # for mongo
npm install @mikro-orm/core @tsed/mikro-orm @mikro-orm/mysql       # for mysql/mariadb
npm install @mikro-orm/core @tsed/mikro-orm @mikro-orm/mariadb     # for mysql/mariadb
npm install @mikro-orm/core @tsed/mikro-orm @mikro-orm/postgresql  # for postgresql
npm install @mikro-orm/core @tsed/mikro-orm @mikro-orm/sqlite      # for sqlite
```

  </Tab>
  <Tab label="Yarn">

```bash
yarn add @mikro-orm/core @tsed/mikro-orm @mikro-orm/mongodb     # for mongo
yarn add @mikro-orm/core @tsed/mikro-orm @mikro-orm/mysql       # for mysql/mariadb
yarn add @mikro-orm/core @tsed/mikro-orm @mikro-orm/mariadb     # for mysql/mariadb
yarn add @mikro-orm/core @tsed/mikro-orm @mikro-orm/postgresql  # for postgresql
yarn add @mikro-orm/core @tsed/mikro-orm @mikro-orm/sqlite      # for sqlite
```

  </Tab>
</Tabs>

Once the installation process is completed, we can import the `MikroOrmModule` into the `Server` configuration:

```typescript
import {Configuration} from "@tsed/di";
import {MikroOrmModule} from "@tsed/mikro-orm";

@Configuration({
  imports: [MikroOrmModule],
  mikroOrm: [
    {
      contextName: 'default',
      type: 'postgres',
      ...,

      entities: [
        `./entity/*{.ts,.js}`
      ]
    },
    {
      contextName: 'mongo',
      type: 'mongo',
      ...
    }
  ]
})
export class Server {}
```

The `mikroOrm` options accepts the same configuration object as `init()` from the MikroORM package. Check [this page](https://mikro-orm.io/docs/configuration) for the complete configuration documentation.

## Obtain ORM instance

`@Orm` decorator lets you retrieve an instance of MikroORM.

```typescript
import {Injectable} from "@tsed/di";
import {AfterRoutesInit} from "@tsed/platform-http";
import {Orm} from "@tsed/mikro-orm";
import {MikroORM} from "@mikro-orm/core";

@Injectable()
export class UsersService {
  @Orm()
  private readonly orm!: MikroORM;

  async create(user: User): Promise<User> {
    // do something
    // ...
    // Then save
    await this.orm.em.persistAndFlush(user);
    console.log("Saved a new user with id: " + user.id);

    return user;
  }

  async find(): Promise<User[]> {
    const users = await this.orm.em.find(User, {});
    console.log("Loaded users: ", users);

    return users;
  }
}
```

It's also possible to inject an ORM by its context name:

```typescript
import {Injectable} from "@tsed/di";

@Injectable()
export class MyService {
  @Orm("mongo")
  private readonly orm!: MikroORM;
}
```

## Obtain EntityManager

`@EntityManager` and `@Em` decorators lets you retrieve an instance of EntityManager.

```typescript
import {Injectable} from "@tsed/di";
import {AfterRoutesInit} from "@tsed/platform-http";
import {Em} from "@tsed/mikro-orm";
import {EntityManager} from "@mikro-orm/mysql"; // Import EntityManager from your driver package or `@mikro-orm/knex`

@Injectable()
export class UsersService {
  @Em()
  private readonly em!: EntityManager;

  async create(user: User): Promise<User> {
    await this.em.persistAndFlush(user);
    console.log("Saved a new user with id: " + user.id);

    return user;
  }
}
```

It's also possible to inject Entity manager by his context name:

```typescript
import {Injectable} from "@tsed/di";
import {AfterRoutesInit} from "@tsed/platform-http";
import {Em} from "@tsed/mikro-orm";
import {EntityManager} from "@mikro-orm/mysql"; // Import EntityManager from your driver package or `@mikro-orm/knex`

@Injectable()
export class UsersService {
  @Em("contextName")
  private readonly em!: EntityManager;

  async create(user: User): Promise<User> {
    await this.em.persistAndFlush(user);
    console.log("Saved a new user with id: " + user.id);

    return user;
  }
}
```

## Use Entity with Controller

To begin, we need to define an Entity MikroORM like this and use Ts.ED Decorator to define the JSON Schema.

```typescript
import {Property, MaxLength, Required} from "@tsed/schema";
import {Entity, Property, PrimaryKey, Property as Column} from "@mikro-orm/core";

@Entity()
export class User {
  @PrimaryKey()
  @Property()
  id!: number;

  @Column()
  @MaxLength(100)
  @Required()
  firstName!: string;

  @Column()
  @MaxLength(100)
  @Required()
  lastName!: string;

  @Column()
  @Mininum(0)
  @Maximum(100)
  age!: number;
}
```

Now, the model is correctly defined and can be used with a [Controller](https://tsed.io/docs/controllers.html)
, [AJV validation](tutorials/ajv.md),
[Swagger](tutorials/swagger.md) and [MikroORM](https://mikro-orm.io/docs/defining-entities).

We can use this model with a Controller like that:

```typescript
import {Controller, Inject} from "@tsed/common";
import {BodyParamst} from "@tsed/platform-params";
import {Post, Post, Get} from "@tsed/schema";

@Controller("/users")
export class UsersCtrl {
  @Inject()
  private readonly usersService!: UsersService;

  @Post("/")
  create(@BodyParams() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get("/")
  getList(): Promise<User[]> {
    return this.usersService.find();
  }
}
```

## Transactions and Request context

As mentioned in the [docs](https://mikro-orm.io/docs/identity-map), we need to isolate a state for each request. That is
handled automatically thanks to the `AsyncLocalStorage` registered via interceptor.

We can use the `@Transactional()` decorator, which will register a new request context for your method and execute it
inside the context.

```typescript
import {BodyParamst} from "@tsed/platform-params";
import {Post, Post, Get} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {Transactional} from "@tsed/mikro-orm";

@Controller("/users")
export class UsersCtrl {
  @Inject()
  private readonly usersService!: UsersService;

  @Post("/")
  @Transactional()
  create(@BodyParams() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get("/")
  getList(): Promise<User[]> {
    return this.usersService.find();
  }
}
```

By default, `IsolationLevel.READ_COMMITTED` is used. You can override it, specifying the isolation level for the transaction by supplying it as the `isolationLevel` parameter in the `@Transactional` decorator:

```typescript
@Post("/")
@Transactional({isolationLevel: IsolationLevel.SERIALIZABLE})
create(@BodyParams() user: User): Promise<User> {
  return this.usersService.create(user);
}
```

The MikroORM supports the standard isolation levels such as `SERIALIZABLE` or `REPEATABLE READ`, the full list of available options see [here](https://mikro-orm.io/docs/transactions#isolation-levels).

You can also set the [flushing strategy](https://mikro-orm.io/docs/unit-of-work#flush-modes) for the transaction by setting the `flushMode`:

```typescript
@Post("/")
@Transactional({flushMode: FlushMode.AUTO})
create(@BodyParams() user: User): Promise<User> {
  return this.usersService.create(user);
}
```

In some cases, you might need to avoid an explicit transaction, but preserve an async context to prevent the usage of the global identity map. For example, starting with v3.4, the MongoDB driver supports transactions. Yet, you have to use a replica set, otherwise, the driver will raise an exception.

To prevent `@Transactional()` use of an explicit transaction, you just need to set the `disabled` field to `true`:

```typescript
@Post("/")
@Transactional({disabled: true})
create(@BodyParams() user: User): Promise<User> {
  return this.usersService.create(user);
}
```

## Retry policy

By default, the automatic retry policy is disabled. You can implement your own to match the business requirements and the nature of the failure. For some noncritical operations, it is better to fail as soon as possible rather than retry a coupe of times. For example, in an interactive web application, it is better to fail right after a smaller number of retries with only a short delay between retry attempts, and display a message to the user (for example, "please try again later").

The `@Transactional()` decorator allows you to enable a retry policy for the particular resources. You just need to implement the `RetryStrategy` interface and use `registerProvider()` or `@OverrideProvider()` to register it in the IoC container. Below you can find an example to handle occurred optimistic locks based on [an exponential backoff retry strategy](https://en.wikipedia.org/wiki/Exponential_backoff).

```typescript
import {OptimisticLockError} from "@mikro-orm/core";
import {RetryStrategy} from "@tsed/mikro-orm";
import {OverrideProvider} from "@tsed/di";
import {setTimeout} from "timers/promises";

@OverrideProvider(RetryStrategy)
export class ExponentialBackoff implements RetryStrategy {
  private readonly maxDepth = 3;
  private depth = 0;

  public async acquire<T extends (...args: unknown[]) => unknown>(task: T): Promise<ReturnType<T>> {
    try {
      return (await task()) as ReturnType<T>;
    } catch (e) {
      if (this.shouldRetry(e as Error) && this.depth < this.options.maxDepth) {
        return this.retry(task);
      }

      throw e;
    }
  }

  private shouldRetry(error: Error): boolean {
    return error instanceof OptimisticLockError;
  }

  private async retry<T extends (...args: unknown[]) => unknown>(task: T): Promise<ReturnType<T>> {
    await setTimeout(2 ** this.depth * 50);

    this.depth += 1;

    return this.acquire(task);
  }
}
```

`ExponentialBackoff` invokes passed function recursively is contained in a try/catch block. The method returns control to the interceptor if the call to the `task` function succeeds without throwing an exception. If the `task` method fails, the catch block examines the reason for the failure. If it's optimistic locking the code waits for a short delay before retrying the operation.

Once a retry strategy is implemented, you can enable an automatic retry mechanism using the `@Transactional` decorator like that:

```typescript
import {BodyParamst} from "@tsed/platform-params";
import {Post, Post, Get} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {Transactional} from "@tsed/mikro-orm";

@Controller("/users")
export class UsersCtrl {
  @Inject()
  private readonly usersService!: UsersService;

  @Post("/")
  @Transactional({retry: true})
  create(@BodyParams() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get("/")
  getList(): Promise<User[]> {
    return this.usersService.find();
  }
}
```

## Managing Lifecycle of Subscribers

With Ts.ED, managing the lifecycle of subscribers registered with Mikro-ORM using the IoC container is simple. To automatically resolve a subscriber's dependencies, you can use the `@Subscriber` decorator as follows:

```typescript
import {EventSubscriber} from "@mikro-orm/core";
import {Subscriber} from "@tsed/mikro-orm";

@Subscriber()
export class SomeSubscriber implements EventSubscriber {
  // ...
}
```

In this example, we register the `SomeSubscriber` subscriber, which is automatically instantiated by the module using the IoC container, allowing you to easily manage the dependencies of your subscribers.

You can also specify the context name for a subscriber to tie it to a particular instance of the ORM:

```typescript
import {EventSubscriber} from "@mikro-orm/core";
import {Subscriber} from "@tsed/mikro-orm";

@Subscriber({contextName: "mongodb"})
export class SomeSubscriber implements EventSubscriber {
  // ...
}
```

## Transaction Hooks

The transaction hooks allow you to customize the default transaction behavior. These hooks enable you to execute custom code before and after committing data to the database. These transaction hooks provide a flexible way to extend the default transaction behavior and implement advanced patterns such as the Inbox pattern or domain event dispatching.

### BeforeTransactionCommit Hook

The `BeforeTransactionCommit` interface allows you to define hooks that are executed right before committing data to the database. This hook provides a way to modify data within the same transaction context and perform additional operations before the transaction is committed.

To use the `BeforeTransactionCommit` hook, first, you have to implement the `BeforeTransactionCommit` interface:

```typescript
import {BeforeTransactionCommit} from "@tsed/mikro-orm";
import {EntityManager} from "@mikro-orm/core";
import {Injectable} from "@tsed/di";

@Injectable()
export class Hooks implements BeforeTransactionCommit {
  $beforeTransactionCommit(em: EntityManager): Promise<unknown> | unknown {
    // Custom code executed before committing data
  }
}
```

Then just write your code inside the `$beforeTransactionCommit` method. This code will be executed before the transaction is committed.

### AfterTransactionCommit Hook

The `AfterTransactionCommit` interface allows you to define hooks that are executed right after committing data to the database. This hook enables you to execute code after the data is committed, making multiple transactions.

To use the `AfterTransactionCommit` hook, you have to implement the `AfterTransactionCommit` interface:

```typescript
import {AfterTransactionCommit} from "@tsed/mikro-orm";
import {EntityManager} from "@mikro-orm/core";
import {Injectable} from "@tsed/di";

@Injectable()
export class Hooks implements AfterTransactionCommit {
  $afterTransactionCommit(em: EntityManager): Promise<unknown> | unknown {
    // Custom code executed after committing data
  }
}
```

::: tip Note
When using the `AfterTransactionCommit` hook, you need to handle eventual consistency and compensatory actions in case of failures on your own.
:::

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
