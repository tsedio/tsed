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

<Badge text="Premium sponsors" />

If you are a premium sponsor, or you want to become one, you can ask [Ts.ED team](https://api.tsed.io/rest/slack/tsedio/tsed) to get your access to the private packages `@tsedio/prisma`.

This package generates enums and classes compatible with Ts.ED decorators like @@Returns@@ and extends possibilities about the `prisma.schema`.

You should follow this tutorial to create your project properly. You will have more details regarding the installation of the `@tsedio/prisma` package.

::: tip Roadmap
The next version will generate also the PrismaService and Repositories for each generated model!
:::

## Install a package from Github

Ask Ts.ED team on [Slack](https://api.tsed.io/slack/tsedio/tsed) to get a unique personal GH_TOKEN.

Then add on your project (or on profile level) a `.npmrc` file with the following content:

```
@tsedio:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=GH_TOKEN
```

Replace the `GH_TOKEN` by your token or by `${GH_TOKEN}` if you want to use env variable.

If you use yarn (v1), you can also add a `.yarnrc` with the following content:

```
"@tsedio:registry" "https://npm.pkg.github.com/tsedio"
```

Then add the package to you package.json:

```json
{
  "name": "@project/server",
  "version": "1.0.0",
  "description": "A Server based on Ts.ED",
  "main": "index.js",
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@tsedio/prisma": "1.0.3"
  }
}
```

Furthermore, `@tsedio/prisma` requires Prisma 2 to work properly, so please install Prisma dependencies if you don't have it already installed:

```sh
npm i -D prisma
npm i @prisma/client
```

::: warning 
Be aware that `@tsedio/prisma` is designed to work with a selected version of `prisma`.

Please make sure you use `prisma` and `@prisma/client` with version matching `~2.22.0`.
Otherwise, the runtime check will report an error when you run the generator.
:::

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
However, if you explicitly choose an other folder in `output` config, the generated code will be emitted as raw TS files which you can use and import as your other source code files.

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
import { User } from "../client";
import { Integer, Required, Property, Groups, Format, Email, Description, Allow, Enum, CollectionOf } from "@tsed/schema";
import { Role } from "../enums";
import { PostModel } from "./PostModel";

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
}
```

And, the following repository:

```typescript
import { isArray } from "@tsed/core";
import { deserialize } from "@tsed/json-mapper";
import { Injectable, Inject } from "@tsed/di";
import { PrismaService } from "../services/PrismaService";
import { Prisma, User } from "../client";
import { UserModel } from "../models";

@Injectable()
export class UsersRepository {
  @Inject()
  protected prisma: PrismaService;

  get collection() {
    return this.prisma.user
  }

  get groupBy() {
    return this.collection.groupBy.bind(this.collection)
  }

  protected deserialize<T>(obj: null | User | User[]): T {
    return deserialize<T>(obj, { type: UserModel, collectionType: isArray(obj) ? Array : undefined })
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
    return this.collection.deleteMany(args)
  }

  async updateMany(args: Prisma.UserUpdateManyArgs) {
    return this.collection.updateMany(args)
  }

  async aggregate(args: Prisma.UserAggregateArgs) {
    return this.collection.aggregate(args)
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
