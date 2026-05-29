<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>TestContainers Postgres</h1>

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.dev/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.dev/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://slack.tsed.dev">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package for the [Ts.ED](https://tsed.dev/) framework to help you test your code using the [TestContainers](https://node.testcontainers.org/) library.

> **Note**: This package does **not** depend on `@tsed/platform-http`. You can use it with any test framework.

---

## ✨ Features

- 🚀 **Spin up a PostgreSQL server** using TestContainers for your tests
- 🛑 **Automatically stop** the PostgreSQL server after your tests
- 🔄 **Reset** the PostgreSQL server between test runs
- 🏷️ **Database support** to isolate databases and avoid collisions between tests

---

## 📦 Installation

Install with your favorite package manager:

```sh npm
npm install --save-dev @tsedio/testcontainers-postgres
```

```sh yarn
yarn add --dev @tsedio/testcontainers-postgres
```

```sh pnpm
pnpm add --dev @tsedio/testcontainers-postgres
```

```sh bun
bun add --dev @tsedio/testcontainers-postgres
```

---

## ⚙️ Configuration

Set up a global test lifecycle to manage the PostgreSQL container.

### 🧪 Vitest

Add a global setup file in your `vitest.config.ts`:

```ts
import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: [import.meta.resolve("@tsed/testcontainers-postgres/vitest/setup")]
  }
});
```

---

### 🧪 Jest (not recommended)

Add `globalSetup` and `globalTeardown` to your Jest config:

```json
{
  "globalSetup": ["jest.setup.js"],
  "globalTeardown": ["jest.teardown.js"]
}
```

Example setup/teardown files:

```ts
// jest.config.js
module.exports = {
  globalSetup: ["jest.setup.js"],
  globalTeardown: ["jest.teardown.js"]
};

// jest.setup.js
import {TestContainersPostgres} from "@tsedio/testcontainers-postgres";

export default async () => {
  await TestContainersPostgres.startContainer();
};

// jest.teardown.js
import {TestContainersPostgres} from "@tsedio/testcontainers-postgres";

export default async () => {
  await TestContainersPostgres.stopContainer();
};
```

---

## 🛠️ Basic Usage

```ts
import {TestContainersPostgres} from "@tsedio/testcontainers-postgres";

describe("MyTest", () => {
  beforeEach(() => {
    const connectionString = TestContainersPostgres.getUrl();
    console.log(connectionString);
  });

  afterEach(async () => {
    await TestContainersPostgres.reset();
  });
});
```

---

## 🤝 Usage with TypeORM

### 🧩 Unit Test Example

```ts
import {PlatformTest} from "@tsed/platform-http/testing";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {TestContainersPostgres} from "@tsedio/testcontainers-postgres";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  email: string;

  @Column()
  name: string;
}

describe("User", () => {
  beforeEach(() =>
    PlatformTest.create({
      typeorm: [
        {
          name: "default",
          type: "postgres",
          entities: [User],
          synchronize: true,
          ...TestContainersPostgres.getPostgresOptions()
        }
      ]
    })
  );

  afterEach(async () => {
    await TestContainersPostgres.reset(); // reset the database
    await PlatformTest.reset();
  });

  it("should create a user", async () => {
    const userRepository = PlatformTest.get(getRepository(User));

    // GIVEN
    const user = userRepository.create({
      email: "test@test.com",
      name: "Test User"
    });

    // WHEN
    await userRepository.save(user);

    // THEN
    expect(user.id).toBeDefined();
  });
});
```

### 🔗 Integration Test Example

Use `PlatformTest.bootstrap` and `TestContainersPostgres.getPostgresOptions()` to start the PostgreSQL server before your tests:

```ts
beforeEach(() =>
  PlatformTest.bootstrap(Server, {
    typeorm: [
      {
        name: "default",
        type: "postgres",
        entities: [User],
        synchronize: true,
        ...TestContainersPostgres.getPostgresOptions()
      }
    ]
  })
);
```

---

## 🔄 Usage with MikroORM

Example using `@tsedio/testcontainers-postgres` with MikroORM:

```ts
import {EntityManager, MikroORM} from "@mikro-orm/core";
import {defineConfig} from "@mikro-orm/postgresql";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersPostgres} from "@tsedio/testcontainers-postgres";

beforeEach(async () => {
  const postgresOptions = TestContainersPostgres.getPostgresOptions();

  await PlatformTest.bootstrap(Server, {
    disableComponentScan: true,
    imports: [MikroOrmModule],
    mikroOrm: [
      defineConfig({
        type: "postgresql",
        host: postgresOptions.host,
        port: postgresOptions.port,
        user: postgresOptions.user,
        password: postgresOptions.password,
        dbName: postgresOptions.database,
        entities: [User],
        subscribers: [UnmanagedEventSubscriber1, new UnmanagedEventSubscriber2()]
      })
    ]
  });
});
```

---

## 💡 Tips

- 🧹 Use `TestContainersPostgres.reset()` to clear the database between tests.
- 🏷️ Use `TestContainersPostgres.reset(dbName)` to drop and recreate a specific database.
- 🧼 Use `TestContainersPostgres.cleanTable(tableName)` to truncate a specific table.
- 🌐 The `getPostgresOptions()` method returns connection options compatible with most PostgreSQL clients.

---

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [TestContainers Node.js](https://node.testcontainers.org/) 🐳

## Contributors

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2024 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
