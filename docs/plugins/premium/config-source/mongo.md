---
head:
  - - meta
    - name: description
      content: A powerful plugin for Ts.ED to manage your application configuration in MongoDB and sync changes in real time.
  - - meta
    - name: keywords
      content: Ts.ED plugins premium mongo config-source watch-mode hot-reload
---

# Mongo Config Source

<Banner src="https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34taa-horizontal_default_slate_blue.svg?auto=format%252Ccompress" height="200" href="https://www.mongodb.com/"></Banner>

A powerful plugin for [Ts.ED](https://tsed.dev/) to manage your application configuration in MongoDB and sync changes in
real time.

## ✨ Features

- ⚙️ **Configure your MongoDB connection** via the @@Configuration@@ decorator.
- 👀 **Watch MongoDB collection changes** and auto-update your app config in real time (leveraging MongoDB Change
  Streams).
- 🔄 **Sync configuration values**: Use MongoDB as a dynamic source of truth for your app settings.
- 🛠️ **Flexible options**: Supports all MongoDB client options, custom collections, and validation schemas.

For more details on the @@ConfigSource@@ feature, go to [Configuration Source documentation page](/docs/configuration/configuration-sources.md).

## 📦 Installation

Install the package and its peer dependencies:

::: code-group

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

:::

::: tip
See our documentation page for instructions on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

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

## ✏️ Set Configuration Values Programmatically

You can update configuration values in MongoDB directly from your services, thanks to dependency injection:

```typescript
import {MongoConfigSource} from "@tsedio/config-mongo";
import {InjectConfigSource} from "@tsed/config/decorators/injectConfigSource.js";
import {Injectable} from "@tsed/di";

@Injectable()
class MyService {
  @InjectConfigSource()
  mongoConfigSource: MongoConfigSource;

  async setValue(key: string, value: any) {
    await this.mongoConfigSource.set(key, value);
  }
}
```

## 💡 Tips

- 🍃 **Change Streams**: Make sure your MongoDB deployment supports Change Streams (requires replica set).
- 🏷️ **Custom Collections**: Use the `collection` option to separate config from your main application data.
- 📚 **Validation**: Add a `validationSchema` to enforce structure and types for your configuration.
- 🔐 **Multiple Sources**: Use different `name` values to manage multiple MongoDB config sources in the same app.

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/) 🍃
