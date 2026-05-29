<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>TestContainers Redis</h1>

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

A [Ts.ED](https://tsed.dev/) package to help you easily test your code using the power of [TestContainers](https://node.testcontainers.org/) with Redis.

> **Note:** This package does **not** depend on `@tsed/platform-http` and can be used with any test framework.

---

## ✨ Features

- 🚀 Easily spin up a Redis server in a Docker container for your tests
- 🛑 Automatically stop the Redis server after your tests
- 🔄 Reset the Redis server state between tests (by restarting the container)
- 🏷️ Namespacing support to avoid collisions between different test suites

---

## 📦 Installation

Install the package with your favorite package manager:

```sh npm
npm install --save-dev @tsedio/testcontainers-redis
```

```sh yarn
yarn add --dev @tsedio/testcontainers-redis
```

```sh pnpm
pnpm add --dev @tsedio/testcontainers-redis
```

```sh bun
bun add --dev @tsedio/testcontainers-redis
```

---

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

---

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

---

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

---

## 💡 Tips

- 🧹 Use `TestContainersRedis.reset()` to clear the Redis server state between tests (by restarting the container).
- 🏷️ Use `TestContainersRedis.getRedisOptions(namespace, options)` to generate Redis connection options:
  - `namespace`: isolates Redis instances between tests.
  - `options`: corresponds to [RedisOptions](https://github.com/redis/ioredis/blob/master/API.md#new-redisport-host-options).
- 🌐 You can set a global namespace with `TestContainersRedis.setNamespace("my-namespace")` if you want to use the same namespace in every call.

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

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - Today Ts.ED

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
