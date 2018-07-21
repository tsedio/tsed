# TypeORM

> Experimental feature. You can contribute to improve this feature !

<div align="center">
<a href="https://typeorm.io/">
<img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" height="128">
</a>
</div>

## Feature

Currently, `@tsed/typeorm` allows you:

- Configure one or more TypeORM connections via the `@ServerSettings` configuration. All databases will be initialized when the server starts during the server's `OnInit` phase.
- Use the Entity TypeORM as Model for Controllers, AJV Validation and Swagger.

## Installation

To begin, install the TypeORM module for TS.ED:
```bash
npm install --save @tsed/typeorm
```

Then import `@tsed/typeorm` in your [ServerLoader](api/common/server/serverloader.md):

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
import {Service, AfterInit} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {Connection} from "typeorm";

@Service()
export class UsersService implement AfterInit {
    private connection: Connection;
    constructor(private typeORMService: TypeORMService) {

    }

    $afterInit() {
        this.connection = typeORMService.get("db1");
    }

    async create(user: User): Promise<User> {

        // do something
        ...
        // Then save
        await connection.manager.save(user);
        console.log("Saved a new user with id: " + user.id);

        return user;
    }

    async find(): Promise<User[]> {
        const users = await connection.manager.find(User);
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

Now, the model is correctly defined and can be used with a [Controller](docs/controllers.md), [AJV validation](tutorials/ajv.md),
[Swagger](tutorials/swagger.md) and [TypeORM](https://github.com/typeorm/typeorm).

We can use this model with a Controller like that:

```typescript
import {Controller, Post, BodyParams} from "@tsed/common";

@Controller("/users")
export class UsersCtrl {

    constructor(private usersService: UsersService) {

    }

    @Post("/")
    create(@BodyParams() user: User): Promise<Users> {

        return this.usersService.create(user);
    }

    @Get("/")
    getList(): Promise<Users> {

        return this.usersService.find(user);
    }
}
```

<div class="guide-links">
<a href="#/tutorials/socket-io">Socket.io</a>
<a href="#/tutorials/Mongoose">Mongoose</a>
</div>