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

If you are premium sponsors, or you want to become it, you can ask [Ts.ED team](https://api.tsed.io/rest/slack/tsedio/tsed) to get your access to the private packages `@tsedio/prisma`.

This package generates enums and classes compatible with the Ts.ED decorators like @@Returns@@ and extend the possibility about the `prisma.schema`.

The following tutorial is to be followed to create your project. You will have more details regarding the installation of the `@tsedio/prisma` package.

::: tip Roadmap
The next version will generate also the PrismaService and Repositories for each generated models!
:::

## Install a package from Github

Ask Ts.ED team on slack to get an uniq personal GH_TOKEN.

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
Be aware that `@tsedio/prisma` is designed to work with a selected versions of `prisma`.

Please make sure you use `prisma` and `@prisma/client` of version matching `~2.22.0`.
Otherwise, the runtime check will report an error when you run the generator.
:::

## Configuration

After installation, you need to update your `schema.prisma` file and then add a new generator section below the `client` one:

```prisma
generator client {
  // ...
}

generator tsed {
  provider = "@tsedio/prisma"
}
```

Then after running `npx prisma generate`, this will emit the generated Ts.ED classes and Enums to `@tsedio/prisma/.schema` in `node_modules` folder.

You can also configure the default output folder, e.g.:

```prisma
generator tsed {
  provider = "@tsedio/prisma"
  output   = "../prisma/generated/tsed"
}
```

By default, when the output path contains `node_modules`, the generated code is transpiled - consist of `*.js` and `*.d.ts` files that are ready to use (import) in your code.
However, if you explicitly choose some other folder in `output` config, the generated code will be emitted as a raw TS files which you can use and import as your other source code files.

You can overwrite that by explicitly setting `emitTranspiledCode` config option:

```prisma
generator tsed {
  provider           = "@tsedio/prisma"
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
import { Integer, Required, Property, Groups, Format, Email, Description, Allow, Enum, CollectionOf } from "@tsed/schema";
import { User } from "../client";
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

Now the Ts.ED generator is correctly configured you can go back (or follow) the tutorial to create the [PrismaService](/tutorials/prisma.md#)