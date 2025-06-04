# Mongo TestContainers

A package for the [Ts.ED](https://tsed.dev/) framework to help you test your code using
the [TestContainers](https://node.testcontainers.org/) library.

> **Note:** This package does **not** depend on `@tsed/platform-http`. You can use it with any test framework.

## ✨ Features

- 🚀 **Spin up a MongoDB server** using TestContainers for your tests
- 🛑 **Automatically stop** the MongoDB server after your tests
- 🔄 **Reset** the MongoDB server between test runs
- 🏷️ **Namespace support** to isolate databases and avoid collisions between tests

## 📦 Installation

Install with your favorite package manager:

::: code-group

```sh [npm]
npm install --save-dev @tsedio/testcontainers-mongo
```

```sh [yarn]
yarn add --dev @tsedio/testcontainers-mongo
```

```sh [pnpm]
pnpm add --dev @tsedio/testcontainers-mongo
```

```sh [bun]
bun add --dev @tsedio/testcontainers-mongo
```

:::

::: warning
See our documentation page for instructions
on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

## ⚙️ Configuration

Set up a global test lifecycle to manage the MongoDB container.

### 🧪 Vitest

Add a global setup file in your `vitest.config.ts`:

```ts
import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: [import.meta.resolve("@tsed/testcontainers-mongo/vitest/setup")]
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
import {TestContainersMongo} from "@tsedio/testcontainers-mongo";

export default async () => {
  await TestContainersMongo.startContainer();
};

// jest.teardown.js
import {TestContainersMongo} from "@tsedio/testcontainers-mongo";

export default async () => {
  await TestContainersMongo.stopContainer();
};
```

## 🛠️ Basic Usage

```ts
import {TestContainersMongo} from "@tsedio/testcontainers-mongo";

describe("MyTest", () => {
  beforeEach(() => {
    const connectionOptions = TestContainersMongo.getMongoOptions();
    console.log(connectionOptions);
  });

  afterEach(async () => {
    await TestContainersMongo.reset();
  });
});
```

## 🤝 Usage with @tsed/mongoose

### 🧩 Unit Test Example

```ts
import {PlatformTest} from "@tsed/platform-http/testing";
import {Property, Required} from "@tsed/schema";
import {Model, MongooseModel, ObjectID, PostHook, PreHook, Unique} from "@tsed/mongoose";
import {TestContainersMongo} from "@tsedio/testcontainers-mongo";

@Model({schemaOptions: {timestamps: true}})
@PreHook("save", (user: UserModel, next: any) => {
  user.pre = "hello pre";
  next();
})
@PostHook("save", (user: UserModel, next: any) => {
  user.post = "hello post";
  next();
})
export class UserModel {
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @Unique()
  email: string;

  @Property()
  pre: string;

  @Property()
  post: string;
}

describe("UserModel", () => {
  beforeEach(() =>
    PlatformTest.create({
      mongoose: [TestContainersMongo.getMongoOptions()]
    })
  );
  afterEach(async () => {
    await TestContainersMongo.reset(); // reset the database
    await PlatformTest.reset();
  });

  it("should run pre and post hooks", async () => {
    const userModel = PlatformTest.get<MongooseModel<UserModel>>(UserModel);

    // GIVEN
    const user = new userModel({
      email: "test@test.fr"
    });

    // WHEN
    await user.save();

    // THEN
    expect(user.pre).toEqual("hello pre");
    expect(user.post).toEqual("hello post");
  });
});
```

### 🔗 Integration Test Example

Use `PlatformTest.bootstrap` and `TestContainersMongo.getMongoOptions("default")` to start the MongoDB server before
your tests:

```ts
beforeEach(() =>
  PlatformTest.bootstrap(Server, {
    mongoose: [TestContainersMongo.getMongoOptions()]
  })
);
```

## 🔄 Usage with MikroORM

Example using `@tsedio/testcontainers-mongo` with MikroORM:

```ts
import {defineConfig} from "@mikro-orm/mongodb";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsedio/testcontainers-mongo";

beforeEach(async () => {
  const mongoSettings = TestContainersMongo.getMongoOptions();

  await PlatformTest.bootstrap(Server, {
    disableComponentScan: true,
    imports: [MikroOrmModule],
    mikroOrm: [
      defineConfig({
        clientUrl: mongoSettings.url,
        driverOptions: mongoSettings.connectionOptions,
        entities: [User],
        subscribers: [UnmanagedEventSubscriber1, new UnmanagedEventSubscriber2()]
      })
    ]
  });
});
```

## 💡 Tips

- 🧹 Use `TestContainersMongo.reset()` to clear the database between tests.
- 🏷️ Use `TestContainersMongo.getMongoOptions(namespace, options)` to generate MongoDB connection options:
  - `namespace` (string): isolates databases between tests.
  - `options` (object): corresponds
    to [MongoClientOptions](https://mongodb.github.io/node-mongodb-native/4.0/interfaces/MongoClientOptions.html).
- 🌐 You can define a global namespace using `TestContainersMongo.setNamespace("my-namespace")` if you don’t want to
  specify it on every call.

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [TestContainers Node.js](https://node.testcontainers.org/) 🐳
