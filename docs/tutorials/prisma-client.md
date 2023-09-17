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

# Ts.ED Prisma client

## Features

Prisma Client generate only TypeScript interfaces based on the Prisma schema. Because, interfaces have no consistency in JavaScript, isn't possible to infer a Json Schema and therefore generate the Swagger documentation or perform validation on the models (without manually writing code).

The `@tsed/prisma` will generates classes and enums compatible with Ts.ED decorators like @@Returns@@ but also, but it will also generate the `PrismaService` (connection to the database) but also the **repositories** for each **model** of your Prisma schema.

## Installation

```sh
npm i -D prisma
npm i @tsed/prisma @prisma/client
```

Or use Ts.ED CLI if you starting a new project:

```
npm install -g
tsed init .
```

Then select `Database` > `Prisma`. The CLI will generate the project with prisma schema configuration.

## Configuration

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

## Usage

Given that you have this part of datamodel definitions:

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

it will generate the following UserModel:

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

## Add Ts.ED decorator

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

Now that the Ts.ED generator is correctly configured, you can go back (or follow) the tutorial to create your [first controller](/tutorials/prisma.html#create-controllers)
