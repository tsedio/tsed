<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
  <h1>Ts.ED - @tsed/config-vault</h1>

[![Build & Release](https://github.com/tsedio/tsed-cli/workflows/Build%20&%20Release/badge.svg?branch=main)](https://github.com/tsedio/tsed-premium-plugins/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed-premium-plugins/blob/main/CONTRIBUTING.md)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![backers](https://opencollective.com/tsed/tiers/badge.svg)](https://opencollective.com/tsed)

  <br />
<div align="center">
  <a href="https://cli.tsed.dev/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://cli.tsed.dev/getting-started.html">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://slack.tsed.dev">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>
  <hr />
</div>

A robust [Ts.ED](https://tsed.dev/) plugin for dynamic application configuration stored securely
in [HashiCorp Vault](https://www.vaultproject.io/).  
Keep your secrets and config synchronized with your app in real time!

---

## ✨ Features

- ⚙️ **Configure HashiCorp Vault** connection easily with the `@Configuration` decorator.
- 🔄 **Poll Vault for changes**: Regularly check Vault for updated secrets and notify your application automatically.
- ✏️ **Sync and update**: Use Vault as a dynamic source of truth for app configuration, and update values
  programmatically.
- 🔒 **Supports both KV v1 and v2**: Compatible with both secret engine versions.

➡️ For more details, see the [official documentation](https://tsed.dev/).

---

## 📦 Installation

Install the package and its dependencies:

```sh npm
npm install --save @tsedio/config-vault
npm install --save @tsed/config node-vault
```

```sh yarn
yarn add @tsedio/config-vault
yarn add @tsed/config node-vault
```

```sh pnpm
pnpm add @tsedio/config-vault
pnpm add @tsed/config node-vault
```

```sh bun
bun add @tsedio/config-vault
bun add @tsed/config node-vault
```

---

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
      refreshInterval: 10000 // ⏱️ Polling interval in ms (default: 10s)
      // Additional node-vault options

      // validationSchema: object({})              // Optional: add a validation schema
    })
  ]
})
export class Server {
  @Constant("configs.vault")
  config: Record<string, any>;
}
```

---

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

---

## ✏️ Set Configuration Values Programmatically

Update config values in Vault from your services using dependency injection:

```typescript
import {VaultConfigSource} from "@tsedio/config-vault";
import {InjectConfigSource} from "@tsed/config/decorators/injectConfigSource.js";
import {Injectable} from "@tsed/di";

@Injectable()
class MyService {
  @InjectConfigSource("vault")
  config: VaultConfigSource;

  async setValue(key: string, value: any) {
    await this.config.set(key, value);
  }
}
```

---

## 🔑 Vault KV Secret Engine Versions

This package works with both KV v1 and v2 engines.  
**For KV v2**, use the full path with `/data/`:

```typescript
// KV v2 (recommended)
secretPath: "secret/data/myapp";

// KV v1
secretPath: "secret/myapp";
```

---

## 💡 Tips

- 🛡️ **Secure access:** Never commit your Vault token to version control!
- 🔁 **Tune `refreshInterval`** to control how often your app checks Vault for updates.
- 🏷️ **Multiple sources:** Use the `name` property for multiple Vault config sources.
- 📚 **Validation:** Use `validationSchema` to enforce your configuration structure.

---

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [HashiCorp Vault](https://www.vaultproject.io/) 🏰
- [node-vault](https://github.com/kr1sp1n/node-vault) 🗝️

---

## Contributors

Please read [contributing guidelines here](https://tsed.dev/CONTRIBUTING.html)

<a href="https://github.com/tsedio/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

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
