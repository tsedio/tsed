<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
  <h1>Ts.ED - @tsed/config-postgres</h1>

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

A powerful plugin for [Ts.ED](https://tsed.dev/) to manage your application configuration in PostgreSQL and sync changes in real time.

## ✨ Features

- ⚙️ **Configure your PostgreSQL connection** via the `@Configuration` decorator.
- 👀 **Watch PostgreSQL table changes** and auto-update your app config in real time (leveraging PostgreSQL LISTEN/NOTIFY).
- 🔄 **Sync configuration values**: Use PostgreSQL as a dynamic source of truth for your app settings.
- 🛠️ **Flexible options**: Supports all PostgreSQL client options, custom tables, and validation schemas.

➡️ Please refer to the [official Ts.ED documentation](https://tsed.dev/) for more details.

---

## 📦 Installation

Install the package and its peer dependencies:

```sh [npm]
npm install --save @tsedio/config-postgres
npm install --save @tsed/config pg
```

```sh [yarn]
yarn add @tsedio/config-postgres
yarn add @tsed/config pg
```

```sh [pnpm]
pnpm add @tsedio/config-postgres
pnpm add @tsed/config pg
```

```sh [bun]
bun add @tsedio/config-postgres
bun add @tsed/config pg
```

---

## ⚙️ Configuration Example

Set up your PostgreSQL config source in your Ts.ED application:

```typescript
import {withOptions} from "@tsed/config";
import {PostgresConfigSource} from "@tsedio/config-postgres";
import {Configuration, Constant} from "@tsed/di";

@Configuration({
  extends: [
    withOptions(PostgresConfigSource, {
      name: "postgres",
      connectionString: "postgresql://postgres:postgres@localhost:5432/my_database", // PostgreSQL connection string
      table: "config" // Table used for config storage

      // Additional PostgreSQL client options can be provided here

      // ConfigSource options
      // validationSchema: object({}) // Optional: add a validation schema
    })
  ]
})
export class Server {
  @Constant("configs.postgres")
  config: Record<string, any>;
}
```

---

## 👀 Watching PostgreSQL Table Changes

Enable real-time watching of your configuration table to auto-sync changes with your application.  
This uses PostgreSQL's LISTEN/NOTIFY feature.

```typescript
@Configuration({
  extends: [
    withOptions(PostgresConfigSource, {
      name: "postgres",
      connectionString: "postgresql://postgres:postgres@localhost:5432/my_database",
      table: "config",
      watch: true // 👈 Enable watch mode for real-time config updates!
    })
  ]
})
export class Server {
  @Constant("configs.postgres")
  config: Record<string, any>;
}
```

---

## ✏️ Set Configuration Values Programmatically

You can update configuration values in PostgreSQL directly from your services, thanks to dependency injection:

```typescript
import {PostgresConfigSource} from "@tsedio/config-postgres";
import {InjectConfigSource} from "@tsed/config/decorators/injectConfigSource.js";
import {Injectable} from "@tsed/di";

@Injectable()
class MyService {
  @InjectConfigSource("postgres")
  config: PostgresConfigSource;

  async setValue(key: string, value: any) {
    await this.config.set(key, value);
  }
}
```

---

## 💡 Tips

- 🐘 **LISTEN/NOTIFY**: Make sure your PostgreSQL deployment supports LISTEN/NOTIFY (most do by default).
- 🏷️ **Custom Tables**: Use the `table` option to separate config from your main application data.
- 📚 **Validation**: Add a `validationSchema` to enforce structure and types for your configuration.
- 🔐 **Multiple Sources**: Use different `name` values to manage multiple PostgreSQL config sources in the same app.

---

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [node-postgres Documentation](https://node-postgres.com/) 🐘

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
