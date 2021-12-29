---
meta:
 - name: description 
   content: Use Mikro ORM with Ts.ED. TypeScript ORM for Node.js based on Data Mapper, Unit of Work and Identity Map patterns. Supports MongoDB, MySQL, MariaDB, PostgreSQL and SQLite databases..
 - name: keywords 
   content: ts.ed express typescript mikro orm node.js javascript decorators
---

# MikroORM

<Banner src="https://raw.githubusercontent.com/mikro-orm/mikro-orm/master/docs/static/img/logo-readme.svg?sanitize=true" href="https://typeorm.io/" height="200" />

## Features

Currently, `@tsed/mikro-orm` allows you:

- Configure one or more MikroORM connections via the `@Configuration` decorator. All databases will be initialized when
  the server starts during the server's `OnInit` phase.
- Use the Entity MikroORM as Model for Controllers, AJV Validation and Swagger.

## Installation

To begin, install the MikroORM module for TS.ED:

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

For more information about MikroORM look his documentation [here](https://mikro-orm.io/docs);

## Obtain a connection

`Connection` decorator lets you retrieve an instance of MikroORM Connection.

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

To begin, we need to define an Entity MikroORM like this and use Ts.ED Decorator to define the JSON Schema.

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
[Swagger](tutorials/swagger.md) and [MikroORM](https://mikro-orm.io/docs/defining-entities).

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

## Author

<GithubContributors :users="['derevnjuk']"/>

## Maintainers

<GithubContributors :users="['derevnjuk']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
