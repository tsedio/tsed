# Postgres TestContainers

A package for the [Ts.ED](https://tsed.dev/) framework to help you test your code using
the [TestContainers](https://node.testcontainers.org/) library.

> **Note**: This package does **not** depend on `@tsed/platform-http`. You can use it with any test framework.

## ✨ Features

- 🚀 **Spin up a PostgreSQL server** using TestContainers for your tests
- 🛑 **Automatically stop** the PostgreSQL server after your tests
- 🔄 **Reset** the PostgreSQL server between test runs
- 🏷️ **Database support** to isolate databases and avoid collisions between tests

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

::: warning
See our documentation page for instructions
on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

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

Use `PlatformTest.bootstrap` and `TestContainersPostgres.getPostgresOptions()` to start the PostgreSQL server before
your tests:

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

## 💡 Tips

- 🧹 Use `TestContainersPostgres.reset()` to clear the database between tests.
- 🏷️ Use `TestContainersPostgres.reset(dbName)` to drop and recreate a specific database.
- 🧼 Use `TestContainersPostgres.cleanTable(tableName)` to truncate a specific table.
- 🌐 The `getPostgresOptions()` method returns connection options compatible with most PostgreSQL clients.

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [TestContainers Node.js](https://node.testcontainers.org/) 🐳
