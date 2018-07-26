---
meta:
 - name: description
   content: Use TypeORM with Express, TypeScript and Ts.ED. ORM for TypeScript and JavaScript (ES7, ES6, ES5). Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, WebSQL databases. Works in NodeJS, Browser, Ionic, Cordova and Electron platforms.
 - name: keywords
   content: ts.ed express typescript typeorm node.js javascript decorators
---
# TypeORM <Badge text="beta" type="warn"/>

<Banner src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" href="https://typeorm.io/" height="128" />

## Feature

Currently, `@tsed/typeorm` allows you:

- Configure one or more TypeORM connections via the `@ServerSettings` configuration. All databases will be initialized when the server starts during the server's `OnInit` phase.
- Use the Entity TypeORM as Model for Controllers, AJV Validation and Swagger.

## Installation

To begin, install the TypeORM module for TS.ED:
```bash
npm install --save @tsed/typeorm
```

Then import `@tsed/typeorm` in your [ServerLoader](/api/common/server/components/ServerLoader.md):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/typeorm"; // import typeorm ts.ed module

@ServerSettings({
   typeorm: {
     'db1': {
        /// TypeORM connection options
     },
     'db2': {
         /// TypeORM connection options
     }
   }
})
export class Server extends ServerLoader {

}
```

## TypeORMService

TypeORMService let you to retrieve an instance of TypeORM Connection.

```typescript
import {Service, AfterRoutesInit} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {Connection} from "typeorm";

@Service()
export class UsersService implement AfterRoutesInit {
    private connection: Connection;
    constructor(private typeORMService: TypeORMService) {

    }

    $afterRoutesInit() {
        this.connection = this.typeORMService.get("db1");
    }

    async create(user: User): Promise<User> {

        // do something
        ...
        // Then save
        await this.connection.manager.save(user);
        console.log("Saved a new user with id: " + user.id);

        return user;
    }

    async find(): Promise<User[]> {
        const users = await this.connection.manager.find(User);
        console.log("Loaded users: ", users);

        return users;
    }

}
```

For more information about TypeORM look his documentation [here](https://github.com/typeorm/typeorm);

## Use Entity TypeORM with Controller

To begin, we need to define an Entity TypeORM like this and use Ts.ED Decorator to define the JSON Schema.

```typescript
import {Property, MaxLength, Required} from "@tsed/common";
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
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

Now, the model is correctly defined and can be used with a [Controller](/docs/controllers.md), [AJV validation](/tutorials/ajv.md),
[Swagger](/tutorials/swagger.md) and [TypeORM](https://github.com/typeorm/typeorm).

We can use this model with a Controller like that:

```typescript
import {Controller, Post, BodyParams} from "@tsed/common";

@Controller("/users")
export class UsersCtrl {

    constructor(private usersService: UsersService) {

    }

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
