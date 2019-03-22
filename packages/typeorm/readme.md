# @tsed/typeorm

> Experimental feature. You can contribute to improve this feature !

<div align="center">
<a href="https://typeorm.io/">
<img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" height="128">
</a>
</div>

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/typeorm

## Feature

Currently, `@tsed/typeorm` allows you:
 
- Configure one or more TypeORM connections via the `@ServerSettings` configuration. All databases will be initialized when the server starts during the server's `OnInit` phase.
- Use the Entity TypeORM as Model for Controllers, AJV Validation and Swagger.

## Installation

To begin, install the TypeORM module for TS.ED:
```bash
npm install --save @tsed/typeorm
```

Then import `@tsed/typeorm` in your [ServerLoader](https://tsed.io/api/common/server/components/ServerLoader.html):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/typeorm"; // import typeorm ts.ed module

@ServerSettings({
   typeorm: [
    {
      name: 'default',
      type: 'postgres',
      ...,

       entities: [
         `${__dirname}/entity/*{.ts,.js}`
       ],
       migrations: [
        `${__dirname}/migrations/*{.ts,.js}`
       ],
       subscribers: [
        `${__dirname}/subscriber/*{.ts,.js}`
       ]
    },
    {
       name: 'mongo',
       type: 'mongodb',
       ...
    }
  ]
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
export class UsersService implements AfterRoutesInit {
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

Now, the model is correctly defined and can be used with a [Controller](https://tsed.io/docs/controllers.html), [AJV validation](tutorials/ajv.md),
[Swagger](tutorials/swagger.md) and [TypeORM](https://github.com/typeorm/typeorm).

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

## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
