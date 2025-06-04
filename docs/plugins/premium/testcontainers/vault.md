# Vault TestContainers

A [Ts.ED](https://tsed.dev/) package to help you easily test your code using the power
of [TestContainers](https://node.testcontainers.org/) with HashiCorp Vault.

> **Note:** This package does **not** depend on `@tsed/platform-http` and can be used with any test framework.

## ✨ Features

- 🚀 Easily spin up a Vault server in a Docker container for your tests
- 🛑 Automatically stop the Vault server after your tests
- 🔄 Reset the Vault server state between tests
- 🔐 Pre-configured with dev mode and root token for easy testing

## 📦 Installation

Install the package with your favorite package manager:

::: code-group

```sh [npm]
npm install --save-dev @tsedio/testcontainers-vault
```

```sh [yarn]
yarn add --dev @tsedio/testcontainers-vault
```

```sh [pnpm]
pnpm add --dev @tsedio/testcontainers-vault
```

```sh [bun]
bun add --dev @tsedio/testcontainers-vault
```

:::

::: warning
See our documentation page for instructions
on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

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

## 🛠️ Usage

Set up a Vault connection in your project like this:

```ts
import {withOptions} from "@tsed/config";
import {DITest} from "@tsed/di";
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

## 💡 Tips

- 🧹 Use `TestContainersVault.reset()` to clear all secrets in the Vault server between tests.
- 🔐 The default root token is `dev-token` and the server runs in dev mode.
- 🌐 You can use `TestContainersVault.getClient()` to get a pre-configured node-vault client.

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [TestContainers Node.js](https://node.testcontainers.org/) 🐳
- [HashiCorp Vault](https://www.vaultproject.io/) 🔐
- [node-vault](https://github.com/kr1sp1n/node-vault) 🗝️
