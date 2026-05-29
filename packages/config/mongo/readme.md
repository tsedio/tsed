<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
  <h1>Ts.ED - @tsed/config-mongo</h1>

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

A powerful plugin for [Ts.ED](https://tsed.dev/) to manage your application configuration in MongoDB and sync changes in real time.

## ✨ Features

- ⚙️ **Configure your MongoDB connection** via the `@Configuration` decorator.
- 👀 **Watch MongoDB collection changes** and auto-update your app config in real time (leveraging MongoDB Change Streams).
- 🔄 **Sync configuration values**: Use MongoDB as a dynamic source of truth for your app settings.
- 🛠️ **Flexible options**: Supports all MongoDB client options, custom collections, and validation schemas.

➡️ Please refer to the [official Ts.ED documentation](https://tsed.dev/) for more details.

---

## 📦 Installation

Install the package and its peer dependencies:

```sh [npm]
npm install --save @tsedio/config-mongo
npm install --save @tsed/config mongodb
```

```sh [yarn]
yarn add @tsedio/config-mongo
yarn add @tsed/config mongodb
```

```sh [pnpm]
pnpm add @tsedio/config-mongo
pnpm add @tsed/config mongodb
```

```sh [bun]
bun add @tsedio/config-mongo
bun add @tsed/config mongodb
```

---

## ⚙️ Configuration Example

Set up your MongoDB config source in your Ts.ED application:

```typescript
import {withOptions} from "@tsed/config";
import {MongoConfigSource} from "@tsedio/config-mongo";
import {Configuration, Constant} from "@tsed/di";

@Configuration({
  extends: [
    withOptions(MongoConfigSource, {
      name: "mongo",
      url: "mongodb://localhost:27017", // MongoDB connection URL
      database: "my_database", // Database name
      collection: "config" // Collection used for config storage

      // Additional MongoDB client options can be provided here

      // ConfigSource options
      // validationSchema: object({}) // Optional: add a validation schema
    })
  ]
})
export class Server {
  @Constant("configs.mongo")
  config: Record<string, any>;
}
```

---

## 👀 Watching MongoDB Collection Changes

Enable real-time watching of your configuration collection to auto-sync changes with your application.  
This uses MongoDB's Change Streams feature.

```typescript
@Configuration({
  extends: [
    withOptions(MongoConfigSource, {
      name: "mongo",
      url: "mongodb://localhost:27017",
      database: "my_database",
      collection: "config",
      watch: true // 👈 Enable watch mode for real-time config updates!
    })
  ]
})
export class Server {
  @Constant("configs.mongo")
  config: Record<string, any>;
}
```

---

## ✏️ Set Configuration Values Programmatically

You can update configuration values in MongoDB directly from your services, thanks to dependency injection:

```typescript
import {MongoConfigSource} from "@tsedio/config-mongo";
import {InjectConfigSource} from "@tsed/config/decorators/injectConfigSource.js";
import {Injectable} from "@tsed/di";

@Injectable()
class MyService {
  @InjectConfigSource("mongo")
  config: MongoConfigSource;

  async setValue(key: string, value: any) {
    await this.config.set(key, value);
  }
}
```

---

## 💡 Tips

- 🍃 **Change Streams**: Make sure your MongoDB deployment supports Change Streams (requires replica set).
- 🏷️ **Custom Collections**: Use the `collection` option to separate config from your main application data.
- 📚 **Validation**: Add a `validationSchema` to enforce structure and types for your configuration.
- 🔐 **Multiple Sources**: Use different `name` values to manage multiple MongoDB config sources in the same app.

---

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/) 🍃

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
