# Redis TestContainers

A [Ts.ED](https://tsed.dev/) package to help you easily test your code using the power
of [TestContainers](https://node.testcontainers.org/) with Redis.

> **Note:** This package does **not** depend on `@tsed/platform-http` and can be used with any test framework.

## ✨ Features

- 🚀 Easily spin up a Redis server in a Docker container for your tests
- 🛑 Automatically stop the Redis server after your tests
- 🔄 Reset the Redis server state between tests (by restarting the container)
- 🏷️ Namespacing support to avoid collisions between different test suites

## 📦 Installation

Install the package with your favorite package manager:

::: code-group

```sh [npm]
npm install --save-dev @tsedio/testcontainers-redis
```

```sh [yarn]
yarn add --dev @tsedio/testcontainers-redis
```

```sh [pnpm]
pnpm add --dev @tsedio/testcontainers-redis
```

```sh [bun]
bun add --dev @tsedio/testcontainers-redis
```

:::

::: tip
See our documentation page for instructions on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

## ⚙️ Configuration

Set up a global test lifecycle to manage your Redis container.

### 🧪 Vitest

Add a global setup in your `vitest.config.ts`:

```ts
import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: [import.meta.resolve("@tsed/testcontainers-redis/vitest/setup")]
  }
});
```

### 🧪 Jest

Add `globalSetup` and `globalTeardown` to your Jest config:

```ts
// jest.config.js
module.exports = {
  globalSetup: ["jest.setup.js"],
  globalTeardown: ["jest.teardown.js"]
};
```

Create the following files:

```ts
// jest.setup.js
import {TestContainersRedis} from "@tsedio/testcontainers-redis";

module.exports = async () => {
  await TestContainersRedis.startContainer();
};

// jest.teardown.js
import {TestContainersRedis} from "@tsedio/testcontainers-redis";

module.exports = async () => {
  await TestContainersRedis.stopContainer();
};
```

## 🛠️ Usage

Set up a Redis connection in your project like this:

```ts
import {registerConnectionProvider} from "@tsed/ioredis";
import {type Redis} from "ioredis";

export const REDIS_CONNECTION = Symbol.for("REDIS_CONNECTION");
export type REDIS_CONNECTION = typeof Redis;

registerConnectionProvider({
  token: REDIS_CONNECTION,
  name: "default"
});
```

Start the Redis server before your tests using `TestContainersRedis`:

```ts
import {PlatformTest, inject} from "@tsed/platform-http/testing";
import {TestContainersRedis} from "@tsedio/testcontainers-redis";

describe("Integration test", () => {
  beforeEach(() => {
    return PlatformTest.create({
      ioredis: [
        {
          name: "redis",
          ...TestContainersRedis.getRedisOptions()
        }
      ]
    });
  });

  afterEach(() => PlatformTest.reset());

  it("should run pre and post hook", async () => {
    const client = inject(REDIS_CONNECTION);
    // do something with the client
  });
});
```

## 💡 Tips

- 🧹 Use `TestContainersRedis.reset()` to clear the Redis server state between tests (by restarting the container).
- 🏷️ Use `TestContainersRedis.getRedisOptions(namespace, options)` to generate Redis connection options:
  - `namespace`: isolates Redis instances between tests.
  - `options`: corresponds
    to [RedisOptions](https://github.com/redis/ioredis/blob/master/API.md#new-redisport-host-options).
- 🌐 You can set a global namespace with `TestContainersRedis.setNamespace("my-namespace")` if you want to use the same
  namespace in every call.

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [TestContainers Node.js](https://node.testcontainers.org/) 🐳
