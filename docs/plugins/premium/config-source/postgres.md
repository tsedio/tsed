---
description: "A powerful plugin for Ts.ED to manage your application configuration in MongoDB and sync changes in real time."
head:
  - - meta
    - name: description
      content: A powerful plugin for Ts.ED to manage your application configuration in MongoDB and sync changes in real time.
  - - meta
    - name: keywords
      content: Ts.ED plugins premium mongo config-source watch-mode hot-reload
---

# Postgres Config Source

A powerful plugin for [Ts.ED](https://tsed.dev/) to manage your application configuration in PostgreSQL and sync changes
in real time.

## ✨ Features

- ⚙️ **Configure your PostgreSQL connection** via the `@Configuration` decorator.
- 👀 **Watch PostgreSQL table changes** and auto-update your app config in real time (leveraging PostgreSQL
  LISTEN/NOTIFY).
- 🔄 **Sync configuration values**: Use PostgreSQL as a dynamic source of truth for your app settings.
- 🛠️ **Flexible options**: Supports all PostgreSQL client options, custom tables, and validation schemas.

For more details on the @@ConfigSource@@ feature, go
to [Configuration Source documentation page](/docs/configuration/configuration-sources.md).

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

::: warning
See our documentation page for instructions
on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

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

## 💡 Tips

- 🐘 **LISTEN/NOTIFY**: Make sure your PostgreSQL deployment supports LISTEN/NOTIFY (most do by default).
- 🏷️ **Custom Tables**: Use the `table` option to separate config from your main application data.
- 📚 **Validation**: Add a `validationSchema` to enforce structure and types for your configuration.
- 🔐 **Multiple Sources**: Use different `name` values to manage multiple PostgreSQL config sources in the same app.

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [node-postgres Documentation](https://node-postgres.com/) 🐘
