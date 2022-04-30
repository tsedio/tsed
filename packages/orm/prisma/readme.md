<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">

   <h1>Ts.ED Prisma</h1>

[![Build & Release](https://github.com/tsedio/tsed/actions/workflows/build.yml/badge.svg)](https://github.com/tsedio/tsed/actions/workflows/build.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/tutorials/prisma.html">Tutorial</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

## Installation

```sh
npm i -D prisma
npm i @tsed/prisma @prisma/client
```

## Configuration

After installation, you need to update your `schema.prisma` file and then add a new generator section below the `client` one:

```prisma
generator client {
  // ...
}

generator tsed {
  provider = "@tsed/prisma"
}
```

Then after running `npx prisma generate`, this will emit the generated Ts.ED classes and Enums to `@tsed/prisma/.schema` in `node_modules` folder.

You can also configure the default output folder, e.g.:

```prisma
generator tsed {
  provider = "@tsed/prisma"
  output   = "../prisma/generated/tsed"
}
```

By default, when the output path contains `node_modules`, the generated code is transpiled - containing `*.js` and `*.d.ts` files that are ready to use (import) in your code.
However, if you explicitly choose an other folder in `output` config, the generated code will be emitted as raw TS files which you can use and import as your other source code files.

You can overwrite that by explicitly setting `emitTranspiledCode` config option:

```prisma
generator tsed {
  provider           = "@tsed/prisma"
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
import {Integer, Required, Property, Groups, Format, Email, Description, Allow, Enum, CollectionOf} from "@tsed/schema";
import {User} from "../client";
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

  @Ignore((value: any, ctx: any) => ctx.endpoint === true)
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

```prisma
model User {
  /// @TsED.Groups("!creation")
  /// Comment
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  /// @TsED.Email()
  /// @TsED.Description("User email. This email must be unique!")
  email       String   @unique
  /// @TsED.Ignore(ctx.endpoint === true)
  ignored    String
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

  @TsED.Ignore((value: any, ctx: any) => ctx.endpoint === true)
  ignored: string;
}
```

## Contributors

Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2021 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
