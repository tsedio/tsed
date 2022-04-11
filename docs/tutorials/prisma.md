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

See issue for more details: [#1389](https://github.com/tsedio/tsed/issues/1389)

::: tip Note
If you want to get a quick overview of how Prisma works, you can follow the [Quickstart](https://www.prisma.io/docs/getting-started/quickstart) or read the [Introduction](https://www.prisma.io/docs/understand-prisma/introduction) in the [documentation](https://www.prisma.io/docs/).
:::

<Projects type="projects"/>

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

From the CLI, select the following features: Swagger, Eslint, Jest, ORM > Prisma.

The `@tsed/prisma` will be automatically installed. This package generates `enums` and `classes` compatible with the Ts.ED decorators like @@Returns@@ and extends possibilities about the `prisma.schema`.
It also generates `PrismaService` and `Repositories`!

::: tip
You can become a sponsor and help us to improve this module. A dedicated tiers is available on Github sponsors [here](https://github.com/sponsors/Romakita/sponsorships?sponsor=Romakita&tier_id=69644&preview=false).
By choosing this options, your feature/fix request treated in top priority.
:::

## Set up Prisma

Start by installing the Prisma CLI as a development dependency in your project:

```sh
cd tsed-prisma
npm install --save-dev prisma
```

In the following steps, we'll be using the [Prisma CLI](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-cli).
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

generator tsed {
  provider = "tsed-prisma"
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

## Prisma client configuration

After installation, you need to update your `schema.prisma` file and then add a new generator section below the `client` one:

```groovy
generator client {
  // ...
}

generator tsed {
  provider = "tsed-prisma"
}
```

Then after running `npx prisma generate`, this will emit the generated Ts.ED classes and Enums to `@tsedio/prisma/.schema` in `node_modules` folder.

You can also configure the default output folder, e.g.:

```groovy
generator tsed {
  provider = "tsed-prisma"
  output   = "../prisma/generated/tsed"
}
```

By default, when the output path contains `node_modules`, the generated code is transpiled - containing `*.js` and `*.d.ts` files that are ready to use (import) in your code.
However, if you explicitly choose another folder in `output` config, the generated code will be emitted as raw TS files which you can use and import as your other source code files.

You can overwrite that by explicitly setting `emitTranspiledCode` config option:

```groovy
generator tsed {
  provider           = "tsed-prisma"
  output             = "../prisma/generated/tsed"
  emitTranspiledCode = true
}
```

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
In this case, the following migration file was created in the existing `prisma` directory:

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
The generated interfaces cannot be used with `@Returns` to describe the Swagger documentation! You have to use the premium package [`@tsedio/prisma`](/tutorials/prisma-client.md)
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

## Generate Models and Repositories

By using the Prisma client and the `@tsed/prisma` module, you'll be able to generate models, enums and repositories each time you use the following command:

```sh
npm run prisma:generate
```

`@tsed/prisma` let you adding extra decorators on your datamodel property to generate the Ts.ED model.
Here is an example of Prisma datamodel with some decorators:

```groovy
model User {
  /// @TsED.Groups("!creation")
  /// Comment
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  /// @TsED.Email()
  /// @TsED.Description("User email. This email must be unique!")
  email       String   @unique
  weight      Float?
  is18        Boolean?
  name        String?
  successorId Int?
  successor   User?    @relation("BlogOwnerHistory", fields: [successorId], references: [id])
  predecessor User?    @relation("BlogOwnerHistory")
  role        Role     @default(USER)
  posts       Post[]
  keywords    String[]
  biography   Json
  /// @TsED.Ignore(ctx.endpoint === true)
  ignored    String
}

model Post {
  id     Int   @id @default(autoincrement())
  user   User? @relation(fields: [userId], references: [id])
  userId Int?
}

enum Role {
  USER
  ADMIN
}
```

Based on our previous example, Prisma Client will generate the following UserModel:

```typescript
import {User} from "../client";
import {Integer, Required, Property, Groups, Format, Email, Description, Allow, Enum, CollectionOf} from "@tsed/schema";
import {Role} from "../enums";
import {PostModel} from "./PostModel";

export class UserModel implements User {
  @Property(Number)
  @Integer()
  @Required()
  @Groups("!creation")
  id: number;

  @Property(Date)
  @Format("date-time")
  @Required()
  createdAt: Date;

  @Property(String)
  @Required()
  @Email()
  @Description("User email. This email must be unique!")
  email: string;

  @Property(Number)
  @Allow(null)
  weight: number | null;

  @Property(Boolean)
  @Allow(null)
  is18: boolean | null;

  @Property(String)
  @Allow(null)
  name: string | null;

  @Property(Number)
  @Integer()
  @Allow(null)
  successorId: number | null;

  @Property(() => UserModel)
  @Allow(null)
  predecessor: UserModel | null;

  @Required()
  @Enum(Role)
  role: Role;

  @CollectionOf(() => PostModel)
  @Required()
  posts: PostModel[];

  @CollectionOf(String)
  @Required()
  keywords: string[];

  @Property(Object)
  @Required()
  biography: any;

  @TsED.Ignore((value: any, ctx: any) => ctx.endpoint === true)
  ignored: string;
}
```

And, the following repository:

```typescript
import {isArray} from "@tsed/core";
import {deserialize} from "@tsed/json-mapper";
import {Injectable, Inject} from "@tsed/di";
import {PrismaService} from "../services/PrismaService";
import {Prisma, User} from "../client";
import {UserModel} from "../models";

@Injectable()
export class UsersRepository {
  @Inject()
  protected prisma: PrismaService;

  get collection() {
    return this.prisma.user;
  }

  get groupBy() {
    return this.collection.groupBy.bind(this.collection);
  }

  protected deserialize<T>(obj: null | User | User[]): T {
    return deserialize<T>(obj, {type: UserModel, collectionType: isArray(obj) ? Array : undefined});
  }

  async findUnique(args: Prisma.UserFindUniqueArgs): Promise<UserModel | null> {
    const obj = await this.collection.findUnique(args);
    return this.deserialize<UserModel | null>(obj);
  }

  async findFirst(args: Prisma.UserFindFirstArgs): Promise<UserModel | null> {
    const obj = await this.collection.findFirst(args);
    return this.deserialize<UserModel | null>(obj);
  }

  async findMany(args?: Prisma.UserFindManyArgs): Promise<UserModel[]> {
    const obj = await this.collection.findMany(args);
    return this.deserialize<UserModel[]>(obj);
  }

  async create(args: Prisma.UserCreateArgs): Promise<UserModel> {
    const obj = await this.collection.create(args);
    return this.deserialize<UserModel>(obj);
  }

  async update(args: Prisma.UserUpdateArgs): Promise<UserModel> {
    const obj = await this.collection.update(args);
    return this.deserialize<UserModel>(obj);
  }

  async upsert(args: Prisma.UserUpsertArgs): Promise<UserModel> {
    const obj = await this.collection.upsert(args);
    return this.deserialize<UserModel>(obj);
  }

  async delete(args: Prisma.UserDeleteArgs): Promise<UserModel> {
    const obj = await this.collection.delete(args);
    return this.deserialize<UserModel>(obj);
  }

  async deleteMany(args: Prisma.UserDeleteManyArgs) {
    return this.collection.deleteMany(args);
  }

  async updateMany(args: Prisma.UserUpdateManyArgs) {
    return this.collection.updateMany(args);
  }

  async aggregate(args: Prisma.UserAggregateArgs) {
    return this.collection.aggregate(args);
  }
}
```

It will be the same for all the models that you declare in the `schema.prisma`!

### Ts.ED decorators usage in Prisma

The generator parse prisma command to find extra Ts.ED decorators. You can use any `@tsed/schema` decorators from Ts.ED by
adding a comment with the following format `/// @TsED.Decorator`. See example above:

```groovy
model User {
  /// @TsED.Groups("!creation")
  /// Comment
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  /// @TsED.Email()
  /// @TsED.Description("User email. This email must be unique!")
  email       String   @unique
}
```

Output:

```typescript
export class UserModel implements User {
  @Property(Number)
  @Integer()
  @Required()
  @Groups("!creation")
  id: number;

  @Property(String)
  @Required()
  @Email()
  @Description("User email. This email must be unique!")
  email: string;
}
```

## Create controllers

Finally, you'll use the repository you generated in the previous sections to implement the different routes of your app.

Now we have to create controllers to expose your business to our consumers. So create the following controllers in `src/controllers` directory:

<Tabs class="-codes">
  <Tab label="UsersController.ts">

```typescript
import {BodyParams, Controller, Get, Post} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Groups, Returns, Summary} from "@tsed/schema";
import {UserModel, UsersRepository} from "@tsed/prisma";

@Controller("/users")
export class UsersController {
  @Inject()
  protected service: UsersRepository;

  @Post("/")
  @Summary("Create a new user")
  @Returns(201, UserModel)
  async signupUser(@BodyParams() @Groups("creation") user: UserModel): Promise<UserModel> {
    return this.service.create({data: user});
  }

  @Get("/")
  @Summary("Filter posts by title or content")
  @Returns(200, Array).Of(UserModel).Description("Return a list of User")
  getAll() {
    return this.service.findMany();
  }
}
```

  </Tab>
  <Tab label="PostsController.ts">

```typescript
import {BodyParams, Controller, Delete, Get, PathParams, Post, Put} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Description, Groups, Name, Returns, Summary} from "@tsed/schema";
import {NotFound} from "@tsed/exceptions";
import {PostModel, PostsRepository} from "@tsed/prisma";

@Controller("/posts")
@Name("Posts")
export class PostsController {
  @Inject()
  protected service: PostsRepository;

  @Get("/:id")
  @Summary("Fetch a single post by its id")
  @Returns(200, PostModel)
  @Returns(404)
  async getById(@PathParams("id") id: string): Promise<PostModel> {
    const model = await this.service.findUnique({where: {id: Number(id)}});

    if (!model) {
      throw new NotFound("Post not found");
    }

    return model;
  }

  @Post("/")
  @Summary("Create a new post")
  @Returns(201, PostModel)
  createDraft(@BodyParams("post") @Groups("creation") post: PostModel, @BodyParams("authorEmail") authorEmail: string) {
    return this.service.create({
      data: {
        title: post.title,
        content: post.content,
        author: {
          connect: {email: authorEmail}
        }
      }
    });
  }

  @Put("/publish/:id")
  @Summary("Publish a post by its id")
  @Returns(200, PostModel)
  async publishPost(@PathParams("id") id: string): Promise<PostModel> {
    return this.service.update({
      where: {id: Number(id)},
      data: {published: true}
    });
  }

  @Delete("/:id")
  @Summary("Delete a post by its id")
  @Returns(200, PostModel)
  async deletePost(@PathParams("id") id: string): Promise<PostModel> {
    return this.service.delete({where: {id: Number(id)}});
  }

  @Get("/search/:searchString")
  @Description("Filter posts by title or content")
  @Returns(200, Array).Of(PostModel)
  async getFilteredPosts(@PathParams("searchString") searchString: string): Promise<PostModel[]> {
    return this.service.findMany({
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
  <Tab label="FeedsController.ts">

```typescript
import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {PostModel, PostsRepository} from "@tsed/prisma";
import {Returns, Summary} from "@tsed/schema";

@Controller("/feeds")
export class FeedsController {
  @Inject()
  protected service: PostsRepository;

  @Get("/")
  @Summary("Fetch all published posts")
  @Returns(200, Array).Of(PostModel)
  getFeeds(): Promise<PostModel[]> {
    return this.service.findMany({
      where: {published: true}
    });
  }
}
```

  </Tab>
</Tabs>

Now start the server and open the Swagger documentation to test your REST API!

## Inject PrismaService

`@tsed/prisma` package generate also the `PrismaService`. You can inject this service as following:

```typescript
import {Injectable, Inject} from "@tsed/di";
import {PrismaService} from "@tsed/prisma";

@Injectable()
export class MyService {
  @Inject()
  protected prisma: PrismaService;
}
```

### Summary

In this tutorial, you learned how to use Prisma along with Ts.ED to implement a REST API.
The controller implementing the routes of the API is calling our Repositories generated with the Prisma Client and uses the generated PrismaService to interact with the database.
