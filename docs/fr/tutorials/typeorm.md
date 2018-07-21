# TypeORM

> Fonctionnalité expérimentale. Vous pouvez contribuer pour améliorer cette fonctionnalité !

<div align="center">
<a href="https://typeorm.io/">
<img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" height="128">
</a>
</div>

## Feature

Actuellement, `@tsed/typeorm` vous permet:

- De configurer une ou plusieurs connections TypeORM via le décorateur `@ServerSettings`. L'ensemble des bases de données seront initialisées au démarrage du serveur lors de la phase `OnInit` du serveur.
- D'utiliser les Entity de TypeORM en tant que Modèle avec Controlleurs, la validation AJV et Swagger.

## Installation

Pour commencez, installer le module TypeORM pour TS.ED:
```bash
npm install --save @tsed/typeorm
```

Ensuite importez `@tsed/typeorm` dans votre [ServerLoader](api/common/server/serverloader.md):

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

TypeORMService vous permet de récupérer une instance Connection de TypeORM.

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

Pour plus d'information sur TypeORM repportez vous à sa [documention](https://github.com/typeorm/typeorm);

## Utilisez Entity TypeORM avec un Controlleur

Pour commencer,  nous avons besoin de definir une Entity TypeORM comme ci-après ainsi que d'utiliser les décorateurs
Ts.ED pour définir un JSONSchema.

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

Maintenant, le modèle est correctement défini et peut être utilisé avec un [Controlleur](docs/controllers.md), avec [AJV validation](tutorials/ajv.md),
[Swagger](tutorials/swagger.md) et [TypeORM](https://github.com/typeorm/typeorm).

Nous pouvons maintenant utiliser le modèle avec un Controlleur comme suivant:

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