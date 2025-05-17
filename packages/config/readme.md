<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/config</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
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

> Configuration management for Ts.ED

A package of Ts.ED framework. See website: https://tsed.dev/

## Installation

```bash
npm install --save @tsed/config
```

## Supported config sources

| Type   | Watch mode | Import                | Description                                                                                                                                                                     |
| ------ | ---------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Envs   | No         | `@tsed/config/envs`   | Load environment variables from the process.env object.                                                                                                                         |
| DotEnv | Yes        | `@tsed/config/dotenv` | Load environment variables from .env files. Supports [dotenv-flow](https://www.npmjs.com/package/dotenv-flow) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand). |
| Json   | Yes        | `@tsed/config/json`   | Load configuration from a JSON file. Supports watch mode to reload the configuration when the file changes.                                                                     |
| YAML   | Yes        | `@tsed/config/yaml`   | Load configuration from a YAML file. Supports watch mode to reload the configuration when the file changes.                                                                     |

## Usage

### Import the module

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/config";
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

### Use the configuration service

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

### Naming a configuration source

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

### Validate configuration

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

### Refresh strategy

#### Watch strategy

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

#### Refresh on request strategy

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

#### Refresh on response strategy

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

### Enable config source on demand

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

### Create a custom configuration provider

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

Copyright (c) 2016 - 2022 Romain Lenzotti

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
