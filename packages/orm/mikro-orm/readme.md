<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>MikroORM</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![Coverage Status](https://coveralls.io/repos/github/tsedio/tsed/badge.svg?branch=production)](https://coveralls.io/github/tsedio/tsed?branch=production)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![backers](https://opencollective.com/tsed/tiers/badge.svg)](https://opencollective.com/tsed)

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

- Configure one or more MikroOrm connections via the `@ServerSettings` configuration. All databases will be initialized
  when the server starts during the server's `OnInit` phase.
- Use the Entity MikroOrm as Model for Controllers, AJV Validation and Swagger.

## Installation

To begin, install the MikroOrm module for TS.ED:

```bash
npm install --save @tsed/mikro-orm
npm install --save @mikro-orm/core
```

Then import `@tsed/mikro-orm` in your Server:

```typescript
import {Configuration} from "@tsed/common";
import {MikroOrmModule} from "@tsed/mikro-orm";

@Configuration({
  imports: [MikroOrmModule],
  mikroOrm: [
    {
      contextName: 'default',
      type: 'postgres',
      ...,

      entities: [
        `${__dirname}/entity/*{.ts,.js}`
      ]
    },
    {
      contextName: 'mongo',
      type: 'mongo',
      ...
    }
  ]
})
export class Server {

}
```

For more information about MikroOrm look his documentation [here](https://mikro-orm.io/docs);

## Obtain a connection

`Connection` decorator lets you retrieve an instance of MikroOrm Connection.

```typescript
import {Injectable, AfterRoutesInit} from "@tsed/common";
import {Connection} from "@tsed/mikro-orm";
import {MikroORM} from "@mikro-orm/core";

@Injectable()
export class UsersService {
  @Connection()
  private readonly connection!: MikroORM;

  async create(user: User): Promise<User> {

    // do something
    // ...
    // Then save
    await this.connection.em.persistAndFlush(user);
    console.log("Saved a new user with id: " + user.id);

    return user;
  }

  async find(): Promise<User[]> {
    const users = await this.connection.em.find(User, {});
    console.log("Loaded users: ", users);

    return users;
  }
}
```

## Use Entity with Controller

To begin, we need to define an Entity MikroOrm like this and use Ts.ED Decorator to define the JSON Schema.

```typescript
import {Property, MaxLength, Required} from "@tsed/common";
import {Entity, Property, PrimaryKey, Property as Column} from "@mikro-orm/core";

@Entity()
export class User {

  @PrimaryKey()
  @Property()
  id: number;

  @Column()
  @MaxLength(100)
  @Required()
  firstName: string;

  @Column()
  @MaxLength(100)
  @Required()
  lastName: string;

  @Column()
  @Mininum(0)
  @Maximum(100)
  age: number;
}
```

Now, the model is correctly defined and can be used with a [Controller](https://tsed.io/docs/controllers.html)
, [AJV validation](tutorials/ajv.md),
[Swagger](tutorials/swagger.md) and [MikroOrm](https://mikro-orm.io/docs/defining-entities).

We can use this model with a Controller like that:

```typescript
import {Controller, Post, BodyParams, Inject, Post, Get} from "@tsed/common";

@Controller("/users")
export class UsersCtrl {
  @Inject()
  private usersService: UsersService;

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
import {Controller, Post, BodyParams, Inject, Get} from "@tsed/common";
import {Transactional} from "@tsed/mikro-orm";

@Controller("/users")
export class UsersCtrl {
  @Inject()
  private usersService: UsersService;

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

## Contributors

Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/tsedio/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

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
