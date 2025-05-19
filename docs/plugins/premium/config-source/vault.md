---
head:
  - - meta
    - name: description
      content: A robust Ts.ED plugin for dynamic application configuration stored securely in HashiCorp Vault. Keep your secrets and config synchronized with your app in real time!
  - - meta
    - name: keywords
      content: Ts.ED plugins premium vault hashicorp config-source
---

# Vault Config Source

<Banner src="/vault.png" height="200" href="https://www.vaultproject.io/"></Banner>

A robust [Ts.ED](https://tsed.dev/) plugin for dynamic application configuration stored securely
in [HashiCorp Vault](https://www.vaultproject.io/).  
Keep your secrets and config synchronized with your app in real time!

## ✨ Features

- ⚙️ **Configure HashiCorp Vault** connection easily with the `@Configuration` decorator.
- 🔄 **Poll Vault for changes**: Regularly check Vault for updated secrets and notify your application automatically.
- ✏️ **Sync and update**: Use Vault as a dynamic source of truth for app configuration, and update values
  programmatically.
- 🔒 **Supports both KV v1 and v2**: Compatible with both secret engine versions.

For more details on the @@ConfigSource@@ feature, go
to [Configuration Source documentation page](/docs/configuration/configuration-sources.md).

## 📦 Installation

Install the package and its dependencies:

::: code-group

```sh [npm]
npm install --save @tsedio/config-vault
npm install --save @tsed/config node-vault
```

```sh [yarn]
yarn add @tsedio/config-vault
yarn add @tsed/config node-vault
```

```sh [pnpm]
pnpm add @tsedio/config-vault
pnpm add @tsed/config node-vault
```

```sh [bun]
bun add @tsedio/config-vault
bun add @tsed/config node-vault
```

:::

::: tip
See our documentation page for instructions
on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

## ⚙️ Configuration Example

Set up your Vault config source in your Ts.ED app:

```typescript
import {withOptions} from "@tsed/config";
import {VaultConfigSource} from "@tsedio/config-vault";
import {Configuration, Constant} from "@tsed/di";

@Configuration({
  extends: [
    withOptions(VaultConfigSource, {
      name: "vault",
      endpoint: "http://localhost:8200", // Vault server URL
      token: "your-vault-token", // Your Vault token
      secretPath: "secret/data/myapp", // Path to your secret (KV v2 or v1, see below)
      refreshInterval: 10000, // ⏱️ Polling interval in ms (default: 10s)
      clientOptions: {
        // Additional node-vault options
      }
      // validationSchema: object({})              // Optional: add a validation schema
    })
  ]
})
export class Server {
  @Constant("configs.vault")
  config: Record<string, any>;
}
```

## 👀 Automatically Watch for Vault Configuration Changes

Since Vault does not provide native change notifications, polling is used to keep your app config in sync:

```typescript
@Configuration({
  extends: [
    withOptions(VaultConfigSource, {
      name: "vault",
      endpoint: "http://localhost:8200",
      token: "your-vault-token",
      secretPath: "secret/data/myapp",
      refreshInterval: 5000 // ⏱️ Check for changes every 5 seconds
    })
  ]
})
export class Server {
  @Constant("configs.vault")
  config: Record<string, any>;
}
```

## ✏️ Set Configuration Values Programmatically

Update config values in Vault from your services using dependency injection:

```typescript
import {VaultConfigSource} from "@tsedio/config-vault";
import {InjectConfigSource} from "@tsed/config/decorators/injectConfigSource.js";
import {Injectable} from "@tsed/di";

@Injectable()
class MyService {
  @InjectConfigSource()
  vaultConfigSource: VaultConfigSource;

  async setValue(key: string, value: any) {
    await this.vaultConfigSource.set(key, value);
  }
}
```

## 🔑 Vault KV Secret Engine Versions

This package works with both KV v1 and v2 engines.  
**For KV v2**, use the full path with `/data/`:

```typescript
// KV v2 (recommended)
secretPath: "secret/data/myapp";

// KV v1
secretPath: "secret/myapp";
```

## 💡 Tips

- 🛡️ **Secure access:** Never commit your Vault token to version control!
- 🔁 **Tune `refreshInterval`** to control how often your app checks Vault for updates.
- 🏷️ **Multiple sources:** Use the `name` property for multiple Vault config sources.
- 📚 **Validation:** Use `validationSchema` to enforce your configuration structure.

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [HashiCorp Vault](https://www.vaultproject.io/) 🏰
- [node-vault](https://github.com/kr1sp1n/node-vault) 🗝️
