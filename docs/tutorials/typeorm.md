---
meta:
  - name: description
    content: Use TypeORM with Ts.ED. ORM for TypeScript and JavaScript (ES7, ES6, ES5). Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, WebSQL databases. Works in NodeJS, Browser, Ionic, Cordova and Electron platforms.
  - name: keywords
    content: ts.ed express typescript typeorm node.js javascript decorators
---

# TypeORM <Badge text="Contributors are welcome" />

<Banner src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" href="https://typeorm.io/" height="200" />

## TypeORM v0.3.x

::: warning

TypeORM v0.3.x is available and change the way on how to create connection (DataSource). His new API,
doesn't require to install the dedicated Ts.ED module. If you come from v0.2.0, keep the Ts.ED module installed and
change the connection by DataSource and update your repositories' implementation.

See our next section for more details about DataSource and Custom Repository.
:::

### Create new connection

Ts.ED CLI support DataSource creation. Just install the latest Ts.ED CLI version and run the followings command:

```sh
tsed generate
```

Then, select TypeORM DataSource options and follow the wizard.

You can also create your DataSource as following in your project:

```typescript
import {registerProvider} from "@tsed/di";
import {DataSource} from "typeorm";
import {Logger} from "@tsed/logger";
import {User} from "../entities/User";

export const MYSQL_DATA_SOURCE = Symbol.for("MySqlDataSource");
export const MysqlDataSource = new DataSource({
  // name: "default",  if you come from v0.2.x
  type: "mysql",
  entities: [User], // add this to discover typeorm model
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test"
});

registerProvider<DataSource>({
  provide: MYSQL_DATA_SOURCE,
  type: "typeorm:datasource",
  deps: [Logger],
  async useAsyncFactory(logger: Logger) {
    await MysqlDataSource.initialize();

    logger.info("Connected with typeorm to database: MySQL");

    return MysqlDataSource;
  },
  hooks: {
    $onDestroy(dataSource) {
      return dataSource.isInitialized && dataSource.close();
    }
  }
});
```

Finally, inject the DataSource in your controller or service:

```typescript
import {Injectable, Inject} from "@tsed/di";
import {DataSource} from "typeorm";
import {MYSQL_DATA_SOURCE} from "../datasources/MysqlDataSource";

@Injectable()
export class MyService {
  @Inject(MYSQL_DATA_SOURCE)
  protected mysqlDataSource: DataSource;

  $onInit() {
    if (this.mysqlDataSource.isInitialized) {
      console.log("INIT");
    }
  }
}
```

### Retrieve all DataSources from a Service

All data sources connection can be retrieved as following:

```typescript
import {Inject, Injectable, InjectorService} from "@tsed/di";

@Injectable()
export class DataSourcesService {
  @Inject()
  protected injector: InjectorService;

  getDataSources() {
    return this.injector.getAll("typeorm:datasource");
  }
}
```

### Use Entity TypeORM with Controller

We need to define an Entity TypeORM like this and use Ts.ED Decorator to define the JSON Schema.

<<< @/tutorials/snippets/typeorm/typeorm-entity.ts

Now, the model is correctly defined and can be used with a [Controller](/docs/controllers.md)
, [AJV validation](/tutorials/ajv.md),
[Swagger](/tutorials/swagger.md) and [TypeORM](https://github.com/typeorm/typeorm).

We can use this model with a Controller like that:

```typescript
import {BodyParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {MYSQL_DATA_SOURCE} from "../datasources/MySqlDataSource";
import {User} from "../entities/User";

@Controller("/users")
export class UsersCtrl {
  @Inject(MYSQL_DATA_SOURCE)
  protected mysqlDataSource: DataSource;

  @Post("/")
  create(@BodyParams() user: User): Promise<User> {
    return this.mysqlDataSource.manager.create(User, user);
  }

  @Get("/")
  getList(): Promise<User[]> {
    return this.mysqlDataSource.manager.find(User);
  }
}
```

### Create an injectable repository

`Repository` is just like `EntityManager` but its operations are limited to a concrete entity.
You can access the repository via `DataSource`.

```typescript
import {Injectable} from "@tsed/di";
import {DataSource} from "typeorm";
import {MySqlDataSource} from "../datasources/MySqlDataSource";
import {User} from "../entities/User";

export const UserRepository = MySqlDataSource.getRepository(User);
export const USER_REPOSITORY = Symbol.for("UserRepository");
export type USER_REPOSITORY = typeof UserRepository;

registerProvider({
  provide: USER_REPOSITORY,
  useValue: UserRepository
});
```

Then inject the `UserRepository` in your controller:

```typescript
import {BodyParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {USER_REPOSITORY} from "../repositories/UserRepository";
import {User} from "../entities/User";

@Controller("/users")
export class UsersCtrl {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  @Post("/")
  create(@BodyParams() user: User): Promise<User> {
    return this.repository.save(user);
  }

  @Get("/")
  getList(): Promise<User[]> {
    return this.repository.find();
  }
}
```

In order to extend `UserRepository` functionality you can use `.extend` method of `Repository` class:

```typescript
import {Injectable} from "@tsed/di";
import {DataSource} from "typeorm";
import {MySqlDataSource} from "../datasources/MySqlDataSource";
import {User} from "../entities/User";

export const UserRepository = MySqlDataSource.getRepository(User).extends({
  findByName(firstName: string, lastName: string) {
    return this.createQueryBuilder("user")
      .where("user.firstName = :firstName", {firstName})
      .andWhere("user.lastName = :lastName", {lastName})
      .getMany();
  }
});
export const USER_REPOSITORY = Symbol.for("UserRepository");
export type USER_REPOSITORY = typeof UserRepository;

registerProvider({
  provide: USER_REPOSITORY,
  useValue: UserRepository
});
```

Then inject the `UserRepository` in your controller:

```typescript
import {BodyParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {User} from "../../entities/User";
import {USER_REPOSITORY} from "../../repositories/UserRepository";

@Controller("/users")
export class UsersController {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  @Get("/")
  getByName(): Promise<User[]> {
    return this.repository.findByName("john");
  }
}
```

## TypeORM v0.2.x (deprecated)

### Features

Currently, `@tsed/typeorm` allows you to:

- Configure one or more TypeORM connections via the `@Configuration` configuration. All databases will be initialized
  when the server starts during the server's `OnInit` phase.
- Use the Entity TypeORM as Model for Controllers, AJV Validation and Swagger.
- Declare a connection with asyncProvider or automatically by server configuration.

### Installation

To begin, install the TypeORM module for TS.ED:

```bash
npm install --save @tsed/typeorm
npm install --save typeorm
```

Then import `@tsed/typeorm` in your Server:

<<< @/tutorials/snippets/typeorm/typeorm-configuration.ts

::: warning

Don't forget to import the TypeORM module in the Server. Ts.ED need it to load correctly the TypeORM DI,
entities and repositories!
:::

### TypeORMService

TypeORMService lets you retrieve an instance of TypeORM Connection.

<<< @/tutorials/snippets/typeorm/typeorm-usage.ts

For more information about TypeORM, look its documentation [here](https://github.com/typeorm/typeorm);

### Declare your connection as provider

It is also possible to create your connection with the `useAsyncFactory` feature (
See [custom providers](/docs/custom-providers.md))
This approach allows you to inject your connection as a Service to another one.

To create a new connection, declare your custom provider as follows:

<<< @/tutorials/snippets/typeorm/typeorm-async-provider.ts

Then inject your connection to another service or provide like this:

<<< @/tutorials/snippets/typeorm/typeorm-injection-async-provider.ts

### Use Entity TypeORM with Controller

We need to define an Entity TypeORM like this and use Ts.ED Decorator to define the JSON Schema.

<<< @/tutorials/snippets/typeorm/typeorm-entity.ts

Now, the model is correctly defined and can be used with a [Controller](/docs/controllers.md)
, [AJV validation](/tutorials/ajv.md),
[Swagger](/tutorials/swagger.md) and [TypeORM](https://github.com/typeorm/typeorm).

We can use this model with a Controller like that:

<<< @/tutorials/snippets/typeorm/typeorm-entity-controller.ts

### EntityRepository

You can create a custom repository which should contain methods to work with your database. Usually custom repositories
are created for a single entity and contain their specific queries. For example, let's say we want to have a method
called `findByName(firstName: string, lastName: string)` which will search for users by a given first and last names.
The best place for this method is in Repository, so we could call it like `userRepository.findByName(...)`. You can
achieve this using custom repositories.

`@tsed/typeorm` plugin configures the DI so that repositories declared for TypeORM can be injected into a Ts.ED
controller or service.

The first way to create a custom repository is to extend Repository. Example:

<<< @/tutorials/snippets/typeorm/typeorm-entity-repository.ts

Then inject your repository to another service:

<<< @/tutorials/snippets/typeorm/typeorm-injection-entity-repository.ts

::: tip Use @@UseConnection@@ decorator to select which database connection the injected repository should be used (
require Ts.ED v5.58.0+).
:::

## Author

<GithubContributors :users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors :users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
