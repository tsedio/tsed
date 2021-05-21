---
meta:
- name: description
  content: Use Prisma with Express, TypeScript and Ts.ED. Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.
- name: keywords
  content: ts.ed express typescript prisma orm node.js javascript decorators 
projects:
- title: Kit Prisma
  href: https://github.com/tsedio/tsed-example-prisma
  src: /prisma-2.svg
---
# Prisma

<Banner src="/prisma-2.svg" height="200" href="https://www.prisma.io/"></Banner>

[Prisma](https://www.prisma.io/) is an [open-source](https://github.com/prisma/prisma) ORM for Node.js and TypeScript. 
It is used as an alternative to writing plain SQL, or using another database access tool such as SQL query builders (like [knex.js](/tutorials/objection.md)) or ORMs (like [TypeORM](/tutorials/typeorm.md) and [Sequelize](https://sequelize.org/)). 
Prisma currently supports PostgreSQL, MySQL, SQL Server and SQLite.

While Prisma can be used with plain JavaScript, it embraces TypeScript and provides a level to type-safety that goes beyond the guarantees other ORMs in the TypeScript ecosystem.
You can find an in-depth comparison of the type-safety guarantees of Prisma and TypeORM [here](https://www.prisma.io/docs/concepts/more/comparisons/prisma-and-typeorm#type-safety).

See issue for more details: https://github.com/tsedio/tsed/issues/1389

::: tip Note
If you want to get a quick overview of how Prisma works, you can follow the [Quickstart](https://www.prisma.io/docs/getting-started/quickstart) or read the [Introduction](https://www.prisma.io/docs/understand-prisma/introduction) in the [documentation](https://www.prisma.io/docs/).
:::

<Projects type="projects"/>

## Prisma generator for Ts.ED <Badge text="Premium sponsors" />

If you are premium sponsors, or you want to become it, you can ask [Ts.ED team](https://api.tsed.io/rest/slack/tsedio/tsed) to get your access to the private packages [`@tsedio/prisma`](/tutorials/prisma-client.md). 

This package generates enums and classes compatible with the Ts.ED decorators like @@Returns@@ and extend the possibility about the `prisma.schema`.

The following tutorial is to be followed to create your project. You will have more details regarding the installation of the [`@tsedio/prisma`](/tutorials/prisma-client.md) package.

## Getting started

In this tutorial, you'll learn how to get started with Ts.ED and Prisma from scratch.
You are going to build a sample Ts.ED application with a REST API that can read and write data in a database.

For the purpose of this guide, you'll use a [SQLite](https://sqlite.org/) database to save the overhead of setting up a database server.

Note that you can still follow this guide, even if you're using PostgreSQL or MySQL – you'll get extra instructions for using these databases at the right places.

::: tip Note
If you already have an existing project and consider migrating to Prisma, you can follow the guide for [adding Prisma to an existing project](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project-typescript-postgres). If you are migrating from TypeORM, you can read the guide [Migrating from TypeORM to Prisma](https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-typeorm). 
:::

## Create a Ts.ED project

To get started, install the Ts.ED CLI and create your app skeleton with the following commands:

```sh
npm install -g @tsed/cli
tsed init tsed-prisma
```
From the CLI, select the following features: Swagger, Eslint, Jest.

## Set up Prisma

Start by installing the Prisma CLI as a development dependency in your project:
```sh
cd tsed-prisma
npm install --save-dev prima
```

In the following steps, we'll be utilizing the [Prisma CLI](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-cli). 
As a best practice, it's recommended to invoke the CLI locally by prefixing it with `npx`:

```sh
npx prisma
```

Now create your initial Prisma setup using the init command of the Prisma CLI:

```sh
npx prisma init
// OR
yarn prisma init
```

- `schema.prisma`: Specifies your database connection and contains the database schema,
- `.env`: A dotenv file, typically used to store your database credentials in a group of environment variables.

## Set the database connection

Your database connection is configured in the `datasource` block in your `schema.prisma` file. By default it's set to `postgresql`, 
but since you're using a SQLite database in this guide you need to adjust the `provider` field of the `datasource` block to `sqlite`:

```groovy
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

Now, open up `.env` and adjust the `DATABASE_URL` environment variable to look as follows:

```bash
DATABASE_URL="file:./dev.db"
```

SQLite databases are simple files; no server is required to use a SQLite database. So instead of configuring a connection URL with a _host_ and _port_, you can just point it to a local file which in this case is called `dev.db`. This file will be created in the next step.

With PostgreSQL and MySQL, you need to configure the connection URL to point to the _database server_.
You can learn more about the required connection URL format [here](https://www.prisma.io/docs/reference/database-reference/connection-urls).

<Tabs>
  <Tab label="PostgreSQL" class="px-5 pb-5">

If you're using PostgreSQL, you have to adjust the `schema.prisma` and `.env` files as follows:

**`schema.prisma`**

```groovy
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

**`.env`**

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

Replace the placeholders spelled in all uppercase letters with your database credentials. Note that if you're unsure what to provide for the `SCHEMA` placeholder, it's most likely the default value `public`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

If you want to learn how to set up a PostgreSQL database, you can follow this guide on [setting up a free PostgreSQL database on Heroku](https://dev.to/prisma/how-to-setup-a-free-postgresql-database-on-heroku-1dc1).
  
  </Tab>
  <Tab label="MySQL" class="px-5 pb-5">

If you're using MySQL, you have to adjust the `schema.prisma` and `.env` files as follows:

**`schema.prisma`**

```groovy
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

**`.env`**

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Replace the placeholders spelled in all uppercase letters with your database credentials.

  </Tab>
</Tabs>

#### Create two database tables with Prisma Migrate

In this section, you'll create two new tables in your database using [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate). 
Prisma Migrate generates SQL migration files for your declarative data model definition in the Prisma schema. 
These migration files are fully customizable so that you can configure any additional features of the underlying database or include additional commands, e.g. for seeding.

Add the following two models to your `schema.prisma` file:

```groovy
model User {
  id    Int     @default(autoincrement()) @id
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @default(autoincrement()) @id
  title     String
  content   String?
  published Boolean? @default(false)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}
```

With your Prisma models in place, you can generate your SQL migration files and run them against the database. 
Run the following commands in your terminal:

```sh
npx prisma migrate dev --name init
```

::: tip
Add the previous command to your `scripts` in the `package.json`:

```json
{
  "scripts": {
    "prisma:migrate": "npx prisma migrate dev --name init"
  }
}
```

:::

This `prisma migrate dev` command generates SQL files and directly runs them against the database. 
In this case, the following migration files was created in the existing `prisma` directory:

```bash
$ tree prisma
prisma
├── dev.db
├── migrations
│   └── 20210507100915_init
│       └── migration.sql
└── schema.prisma
```

### Install and generate Prisma Client

Prisma Client is a type-safe database client that's _generated_ from your Prisma model definition.
Because of this approach, Prisma Client can expose [CRUD](https://www.prisma.io/docs/concepts/components/prisma-client/crud) operations that are _tailored_ specifically to your models.

To install Prisma Client in your project, run the following command in your terminal:

```bash
$ npm install @prisma/client
```

Note that during installation, Prisma automatically invokes the `prisma generate` command for you.
In the future, you need to run this command after _every_ change to your Prisma models to update your generated Prisma Client.

The `prisma generate` command reads your Prisma schema and updates the generated Prisma Client library inside `node_modules/@prisma/client`.

::: warning
The generated interfaces cannot be used with `@Returns` to describe the Swagger documentation! You have to use the premium packages [`@tsedio/prisma`](/tutorials/prisma-client.md)
:::

::: tip
Add the previous command to your `scripts` in the `package.json`:

```json
{
  "scripts": {
    "prisma:generate": "npx prisma generate"
  }
}
```
:::

## Configure Ts.ED prisma client <Badge text="Premium sponsors" />

Now our `prisma.schema` is ready for the basic usage. It's time to configure the [`@tsedio/prisma`](/tutorials/prisma-client.md)

## Create the PrismaService and PostService

You're now able to send database queries with Prisma Client. If you want to learn more about building queries with Prisma Client, 
check out the [API documentation](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/crud).

When setting up your Ts.ED application, you'll want to abstract away the Prisma Client API for database queries within a service. 
To get started, you can create a new `PrismaService` that takes care of instantiating `PrismaClient` and connecting to your database.

Inside the `src/services` directory, create a new file called `PrismaService.ts` and add the following code to it:

```typescript
import { Injectable, OnInit, OnDestroy } from '@tsed/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnInit, OnDestroy {
  async onInit() {
    await this.$connect();
  }

  async onDestroy() {
    await this.$disconnect();
  }
}
```

## Create UserService

Next, you can write services that you can use to make database calls for the `User` and `Post` models from your Prisma schema.

Still inside the `src/services` directory, create a new file called `UserService.ts` and add the following code to it:

```typescript
import {Inject, Injectable} from "@tsed/di";
import {Prisma, User} from "@prisma/client";
import {PrismaService} from "./PrismaService";

@Injectable()
export class UserService {
  @Inject()
  prisma: PrismaService;

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByInput;
  }): Promise<User[]> {
    const {skip, take, cursor, where, orderBy} = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data
    });
  }

  async updateUser(params: {where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput}): Promise<User> {
    const {where, data} = params;
    return this.prisma.user.update({
      data,
      where
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where
    });
  }
}
```

Notice how you're using Prisma Client's generated types to ensure that the methods that are exposed by your service are properly typed. 
You therefore save the boilerplate of typing your models and creating additional interface or DTO files.

Now do the same for the `Post` model.

Still inside the `src` directory, create a new file called `PostService.ts` and add the following code to it:

```typescript
import {Post, Prisma} from "@prisma/client";
import {Inject, Injectable} from "@tsed/di";
import {PrismaService} from "./PrismaService";

@Injectable()
export class PostService {
  @Inject()
  prisma: PrismaService;

  async post(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByInput;
  }): Promise<Post[]> {
    const {skip, take, cursor, where, orderBy} = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    });
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data
    });
  }

  async updatePost(params: {where: Prisma.PostWhereUniqueInput; data: Prisma.PostUpdateInput}): Promise<Post> {
    const {data, where} = params;
    return this.prisma.post.update({
      data,
      where
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where
    });
  }
}
```

Your `UserService` and `PostService` currently wrap the CRUD queries that are available in Prisma Client. 
In a real world application, the service would also be the place to add business logic to your application. 
For example, you could have a method called `updatePassword` inside the `UserService` that would be responsible for updating the password of a user.

## Create controllers

Finally, you'll use the services you created in the previous sections to implement the different routes of your app. 

Now we have to create controllers to exposes your business to our consumers. So create the following controllers in `src/controllers` directory:

<Tabs class="-codes">
  <Tab label="UsersController.ts">

```typescript
import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Returns} from "@tsed/schema";
import {UserModel} from "@tsedio/prisma"; // Remove it if you haven't the @tsedio/prisma package access!
import {UserService} from "../services/UserService";

@Controller("/users")
export class UsersController {
  @Inject()
  service: UserService;
  
  @Get("/")
  @(Returns(200, Array).Of(UserModel).Description("Return a list of User"))
  getAll() {
    return this.service.users({});
  }
}
````

  </Tab>
  <Tab label="UsersController.ts">

```typescript
import {Controller, Get, PathParams} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Name, Returns} from "@tsed/schema";
import {NotFound} from "@tsed/exceptions";
import {PostModel} from "@tsedio/prisma"; // Remove it if you haven't the @tsedio/prisma package access!
import {PostService} from "../services/PostService";

@Controller("/posts")
@Name("Posts")
export class PostsController {
  @Inject()
  service: PostService;

  @Get("/:id")
  @(Returns(200, PostModel).Description("Get a Post by his id"))
  async getById(@PathParams("id") id: string): Promise<PostModel> {
    const model = await this.service.post({id: Number(id)});

    if (!model) {
      throw new NotFound("Post not found");
    }

    return model;
  }

  @Get("/search/:searchString")
  @(Returns(200, Array).Of(PostModel))
  async getFilteredPosts(@PathParams("searchString") searchString: string): Promise<PostModel[]> {
    return this.service.posts({
      where: {
        OR: [
          {
            title: {contains: searchString}
          },
          {
            content: {contains: searchString}
          }
        ]
      }
    });
  }
}
```
  </Tab>
  <Tab label="">

```typescript
import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {PostModel} from "@tsedio/prisma"; // Remove it if you haven't the @tsedio/prisma package access!
import {Returns} from "@tsed/schema";
import {PostService} from "../services/PostService";

@Controller("/feeds")
export class FeedsController {
  @Inject()
  service: PostService;

  @Get("/")
  @(Returns(200, Array).Of(PostModel))
  getFeeds() {
    return this.service.posts({
      where: {published: true}
    });
  }
}
```

  </Tab>
</Tabs>

### Summary

In this tutorial, you learned how to use Prisma along with Ts.ED to implement a REST API. 
The controller that implements the routes of the API is calling a `PrismaService` which in turn uses Prisma Client to send queries to a database to fulfill the data needs of incoming requests.
