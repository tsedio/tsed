# Configuration sources

Formerly known as @@ConfigSource@@, this module provides a way to load configuration from different sources like
environment variables, JSON files, YAML files, and more.

It allows you to define a configuration schema and validate the configuration values at runtime.
You can also use it to watch for changes in the configuration files and reload the configuration automatically, without
reloading the server or application (excepting for port or specific options).

You can also create your own configuration sources by implementing the @@ConfigSource@@ interface!

## Supported config sources

| Type   | Watch mode | Import                | Description                                                                                                                                                                     |
| ------ | ---------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Envs   | No         | `@tsed/config/envs`   | Load environment variables from the process.env object.                                                                                                                         |
| DotEnv | Yes        | `@tsed/config/dotenv` | Load environment variables from .env files. Supports [dotenv-flow](https://www.npmjs.com/package/dotenv-flow) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand). |
| Json   | Yes        | `@tsed/config/json`   | Load configuration from a JSON file. Supports watch mode to reload the configuration when the file changes.                                                                     |
| YAML   | Yes        | `@tsed/config/yaml`   | Load configuration from a YAML file. Supports watch mode to reload the configuration when the file changes.                                                                     |

## Premium config sources

| Type                                                 | Watch mode    | Import                  | Description                                                                                                                        |
| ---------------------------------------------------- | ------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [IORedis](/plugins/premium/config-source/ioredis.md) | Yes           | `@tsed/config/ioredis`  | Load configuration from a Redis database using ioredis. Supports watch mode to reload the configuration when the database changes. |
| [Mongo](/plugins/premium/config-source/mongo.md)     | Yes           | `@tsed/config/mongo`    | Load configuration from a MongoDB collection. Supports watch mode to reload the configuration when the collection changes.         |
| [Vault](/plugins/premium/config-source/vault.md)     | Yes - polling | `@tsed/config/vault`    | Load configuration from a HashiCorp Vault. Supports watch mode to reload the configuration when the vault changes.                 |
| Postgres - WIP                                       | Yes - polling | `@tsed/config/postgres` | Load configuration from a Postgres database. Supports watch mode to reload the configuration when the database changes.            |

::: warning Wants more?
Ask us for a custom config source! We can create a custom config source for you, tailored to your needs.
Contact us at [contact-tsed@gmail.com](mailto:contact-tsed@gmail.com) or via [Slack](https://slack.tsed.io/).
:::

## Installation

::: code-group

```sh [npm]
npm install --save @tsed/config
```

```sh [yarn]
yarn add @tsed/config
```

```sh [pnpm]
pnpm add @tsed/config
```

```sh [bun]
bun add @tsed/config
```

:::

Some config sources require additional packages to be installed. Here are the installation commands for each source:

### Installation for dotenv

::: code-group

```sh [npm]
npm install --save dotenv dotenv-expand dotenv-flow
```

````

```sh [yarn]
yarn add dotenv dotenv-expand dotenv-flow
````

```sh [pnpm]
pnpm add dotenv dotenv-expand dotenv-flow
```

```sh [bun]
bun add dotenv dotenv-expand dotenv-flow
```

:::

### Installation for yaml

::: code-group

```sh [npm]
npm install --save js-yaml
```

```sh [yarn]
yarn add js-yaml
```

```sh [pnpm]
pnpm add js-yaml
```

```sh [bun]
bun add js-yaml
```

:::

## Usage

You need to import the `@tsed/config` module in your application. You can do this in your `Server.ts` file:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/config"; // import the module to enable `.extends[]` options
import {EnvsConfigSource} from "@tsed/config/envs";
import {JsonConfigSource} from "@tsed/config/json";
import {withOptions} from "@tsed/config";

@Configuration({
  extends: [
    withOptions(JsonConfigSource, {
      path: "./config.json"
    }),
    EnvsConfigSource
  ]
})
export class Server {}
```

The `extends` option allows you to define multiple configuration sources. The order of the sources matters, as the last
source will
override the previous ones. In this example, the `EnvsConfigSource` will override any values defined in the
`JsonConfigSource`.

## Accessing configuration values

`@tsed/config` merge all configuration sources in a single object, but it also creates a configuration namespace for
each source under
the `configs` key. This allows you to access the configuration values from each source separately.

```typescript
import {Injectable} from "@tsed/di";

@Injectable()
export class MyService {
  @Constant("myConfigKey")
  myConfigKey: string; // merge value from all sources

  @Constant("configs.json.myConfigKey")
  myConfigKeyFromJson: string; // get value from json file only

  @Constant("configs.env.myConfigKey")
  myConfigKeyFromEnv: string; // get value from env file only

  constructor() {
    console.log(this.myConfigKey); // "myValue"
  }
}
```

## Naming a configuration source

You can name a configuration source by using the `name` option. This is useful when you have multiple sources and want
to differentiate between them.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/config";
import {EnvsConfigSource} from "@tsed/config/envs";
import {JsonConfigSource} from "@tsed/config/json";
import {withOptions} from "@tsed/config";

@Configuration({
  extends: [
    withOptions(JsonConfigSource, {
      name: "database",
      path: "./db.json"
    }),
    withOptions(JsonConfigSource, {
      name: "server",
      path: "./server.json"
    }),
    EnvsConfigSource
  ]
})
export class Server {}
```

Then you can use the `@Constant` decorator to inject the configuration value from a specific source:

```typescript
import {Injectable} from "@tsed/di";

@Injectable()
export class MyService {
  @Constant("configs.database.host")
  databaseHost: string; // get value from json file only

  @Constant("configs.server.port")
  port: string; // get value from env file only
}
```

## Validate configuration

You can validate your configuration using the `validationSchema` option. This is useful to ensure that your
configuration values are of the expected type.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/config";
import {string, object} from "@tsed/schema";
import {EnvsConfigSource} from "@tsed/config/envs";

@Configuration({
  extends: [
    withOptions(EnvsConfigSource, {
      validationSchema: object({
        DATABASE_HOST: string().required()
      })
    })
  ]
})
export class Server {}
```

## Refresh strategy

### Watch strategy

You can use the `watch` strategy to automatically reload your configuration when the file changes.
This is useful for development environments where you want to see changes immediately.

```typescript
import {Configuration} from "@tsed/di";
import {withOptions} from "@tsed/config";
import {JsonConfigSource} from "@tsed/config/json";

@Configuration({
  extends: [
    withOptions(JsonConfigSource, {
      watch: true
    })
  ]
})
export class Server {}
```

### Refresh on request strategy

You can use the `request` strategy to reload your configuration on each request.
This is useful for dynamic configurations that may change at runtime.

```typescript
import {Configuration} from "@tsed/di";
import {withOptions} from "@tsed/config";
import {MyDbSourceConfig} from "./sources/DbSourceConfig.js";

@Configuration({
  extends: [
    withOptions(MyDbSourceConfig, {
      refreshOn: "request"
    })
  ]
})
export class Server {}
```

> Important: Use the `request` strategy with caution, as it can impact performance.
> It's recommended to use it only for configurations that are expected to change frequently.

### Refresh on response strategy

You can use the `response` strategy to reload your configuration on each response.

This is useful for dynamic configurations that may change at runtime. This version is more efficient than the `request`
strategy, as it only reloads the configuration after a response is sent.

```typescript
import {Configuration} from "@tsed/di";
import {withOptions} from "@tsed/config";
import {MyDbSourceConfig} from "./sources/DbSourceConfig.js";

@Configuration({
  extends: [
    withOptions(MyDbSourceConfig, {
      refreshOn: "response"
    })
  ]
})
export class Server {}
```

## Enable config source on demand

You can enable a config source on demand by using the `enable` option. This is useful when you want to load a
configuration source only when needed.

```typescript
import {Configuration} from "@tsed/di";
import {withOptions} from "@tsed/config";
import {MyDbSourceConfig} from "./sources/DbSourceConfig.js";

@Configuration({
  extends: [
    withOptions(MyDbSourceConfig, {
      enable: process.env.NODE_ENV === "production"
    })
  ]
})
export class Server {}
```

## Create a custom configuration source

### Basic configuration source

You can create a custom configuration source by implementing the `ConfigSource` interface:

```typescript
import type {ConfigSource} from "@tsed/config";

export interface MyCustomConfigSourceOptions {
  // Custom options
}

export class MyCustomConfigSource implements ConfigSource<MyCustomConfigSourceOptions> {
  options: MyCustomConfigSourceOptions;

  async getAll(): Promise<Record<string, unknown>> {
    return {
      key: value
    };
  }
}
```

Then use it in your configuration:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/config";
import {MyCustomConfigSource} from "./MyCustomConfigSource.js";

@Configuration({
  extends: [
    MyCustomConfigSource,
    // or with options
    withOptions(MyCustomConfigSource, {
      // options
    })
  ]
})
export class Server {}
```

### Implement watch method

You can implement the `watch` method to listen for changes in your configuration source. This is useful for dynamic
configurations that may change at runtime.

```typescript
import {ConfigSource} from "@tsed/config";
import {watch} from "node:fs";

export interface MyCustomProviderOptions {
  path: string;
}

export class MyCustomConfigSource implements ConfigSource<MyCustomConfigSourceOptions> {
  options: MyCustomConfigSourceOptions;

  async getAll(): Promise<Record<string, unknown>> {
    const {path, encoding = "utf8"} = this.options;
    // Read the file
    const fileContent = readFileSync(path, encoding);

    return JSON.parse(fileContent);
  }

  watch(onChange: () => void) {
    const {path} = this.options;
    const watcher = watch(path, onChange);

    return () => {
      watcher.close();
    };
  }
}
```

## Inject configuration source

Given a configuration source, you can inject it in any service or controller using his name.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/config";
import {withOptions} from "@tsed/config";
import {MyCustomConfigSource} from "./configs/MyCustomConfigSource.js";

@Configuration({
  extends: [
    withOptions(MyCustomConfigSource, {
      name: "myCustomConfig"
    })
  ]
})
export class Server {}
```

Then you can inject it in your service or controller using the `@InjectConfigSource` decorator:

```typescript
import {Injectable, Inject} from "@tsed/di";
import {InjectConfigSource} from "@tsed/config/decorators/injectConfigSource.js";
import {MyCustomConfigSource} from "./configs/MyCustomConfigSource.js";

@Injectable()
export class MyService {
  @InjectConfigSource("myCustomConfig")
  configSource: MyCustomConfigSource;
}
```

Or using function `injectConfigSource`:

```typescript
import {Injectable} from "@tsed/di";
import {injectConfigSource} from "@tsed/config/fn/injectConfigSource.js";
import {MyCustomConfigSource} from "./configs/MyCustomConfigSource.js";

@Injectable()
export class MyService {
  configSource = injectConfigSource<MyCustomConfigSource>("myCustomConfig");
}
```

## Roadmap

These config sources are not implemented yet, but we plan to implement them in the future:

- Consul / etcd
- SSM Parameter Store / Vault / GCP/Azure équivalents
- Kubernetes ConfigMap/Secret
- HTTP/REST
- Git (GitOps)

::: warning Wants more?
Ask us for a custom config source! We can create a custom config source for you, tailored to your needs.
Contact us at contact-tsed@gmail.com or via [Slack](https://slack.tsed.io/).
:::
