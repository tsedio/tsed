<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>TestContainers Vault</h1>

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

A [Ts.ED](https://tsed.dev/) package to help you easily test your code using the power
of [TestContainers](https://node.testcontainers.org/) with HashiCorp Vault.

> **Note:** This package does **not** depend on `@tsed/platform-http` and can be used with any test framework.

---

## ✨ Features

- 🚀 Easily spin up a Vault server in a Docker container for your tests
- 🛑 Automatically stop the Vault server after your tests
- 🔄 Reset the Vault server state between tests
- 🔐 Pre-configured with dev mode and root token for easy testing

---

## 📦 Installation

Install the package with your favorite package manager:

```sh npm
npm install --save-dev @tsedio/testcontainers-vault
```

```sh yarn
yarn add --dev @tsedio/testcontainers-vault
```

```sh pnpm
pnpm add --dev @tsedio/testcontainers-vault
```

```sh bun
bun add --dev @tsedio/testcontainers-vault
```

---

## ⚙️ Configuration

Set up a global test lifecycle to manage your Vault container.

### 🧪 Vitest

Add a global setup in your `vitest.config.ts`:

```ts
import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: [import.meta.resolve("@tsed/testcontainers-vault/vitest/setup")]
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
import {TestContainersVault} from "@tsedio/testcontainers-vault";

module.exports = async () => {
  await TestContainersVault.startContainer();
};

// jest.teardown.js
import {TestContainersVault} from "@tsedio/testcontainers-vault";

module.exports = async () => {
  await TestContainersVault.stopContainer();
};
```

---

## 🛠️ Usage

Set up a Vault connection in your project like this:

```ts
import {withOptions} from "@tsed/config";
import {VaultConfigSource} from "@tsedio/config-vault";
import {TestContainersVault} from "@tsedio/testcontainers-vault";

describe("Integration test", () => {
  beforeEach(async () => {
    return DITest.create({
      extends: [
        withOptions(VaultConfigSource, {
          name: "vault",
          ...TestContainersVault.getVaultOptions(),
          secretPath: "secret/data/tsed-test"
        })
      ]
    });
  });

  afterEach(() => DITest.reset());

  it("should store and retrieve secrets", async () => {
    const configs = inject<CONFIG_SOURCES>(CONFIG_SOURCES);
    const instance = configs.vault as VaultConfigSource;

    await instance.set("hello", "world");
    const result = await instance.getAll();

    expect(result).toEqual({
      hello: "world"
    });
  });
});
```

---

## 💡 Tips

- 🧹 Use `TestContainersVault.reset()` to clear all secrets in the Vault server between tests.
- 🔐 The default root token is `dev-token` and the server runs in dev mode.
- 🌐 You can use `TestContainersVault.getClient()` to get a pre-configured node-vault client.

---

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [TestContainers Node.js](https://node.testcontainers.org/) 🐳
- [HashiCorp Vault](https://www.vaultproject.io/) 🔐
- [node-vault](https://github.com/kr1sp1n/node-vault) 🗝️

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

Copyright (c) 2016 - Today Ts.ED

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
