<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
  <h1>Ts.ED - @tsed/config-ioredis</h1>

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

A powerful plugin for [Ts.ED](https://tsed.dev/) to manage your application configuration in Redis and sync changes in real time.

---

## ✨ Features

- ⚙️ **Configure one or more Redis connections** using the `@Configuration` decorator.
- 👀 **Watch Redis keys** and automatically notify your application of any changes.
- 🔄 **Sync configuration values** between your app and Redis, using Redis as a dynamic source of truth.
- 🛠️ **Flexible options:** Supports standard Redis, Redis Cluster, and custom key prefixing.
- 🔒 **Validation schema:** Add a validation schema to ensure your configs are always valid.

For more information, check out the [official documentation](https://tsed.dev/).

---

## 📦 Installation

Install the package and its peer dependencies:

```sh [npm]
npm install --save @tsedio/config-ioredis
npm install --save @tsed/config @tsed/ioredis ioredis
```

```sh [yarn]
yarn add @tsedio/config-ioredis
yarn add @tsed/config @tsed/ioredis ioredis
```

```sh [pnpm]
pnpm add @tsedio/config-ioredis
pnpm add @tsed/config @tsed/ioredis ioredis
```

```sh [bun]
bun add @tsedio/config-ioredis
bun add @tsed/config @tsed/ioredis ioredis
```

---

## ⚙️ Configuration Example

Configure the Redis source in your Ts.ED application:

```typescript
import {withOptions} from "@tsed/config";
import {IORedisConfigSource} from "@tsedio/config-ioredis";
import {Configuration, Constant} from "@tsed/di";

@Configuration({
  extends: [
    withOptions(IORedisConfigSource, {
      name: "redis",
      prefixKey: "my-config", // Optional: All config keys will be prefixed
      url: "redis://localhost:6379" // Or use any Redis/Cluster options
      // validationSchema: object({}) // Optional: add a validation schema
    })
  ]
})
export class Server {
  @Constant("configs.redis")
  config: Record<string, any>;
}
```

---

## 👀 Watching Redis Keys

Enable key watching to keep your app config in sync with Redis in real time.  
This will automatically configure Redis with `notify-keyspace-events` if needed.

```typescript
@Configuration({
  extends: [
    withOptions(IORedisConfigSource, {
      name: "redis",
      prefixKey: "my-config",
      watch: true, // 👈 Enable key watching!
      url: "redis://localhost:6379"
    })
  ]
})
export class Server {
  @Constant("configs.redis")
  config: Record<string, any>;
}
```

---

## ✏️ Set Configuration Values Programmatically

You can update configuration values in Redis directly from your services, using dependency injection.

```typescript
import {IORedisConfigSource} from "@tsed/ioredis-config";
import {InjectConfigSource} from "@tsed/config/decorators/injectConfigSource.js";
import {Injectable} from "@tsed/di";

@Injectable()
class MyService {
  @InjectConfigSource("redis")
  config: IORedisConfigSource;

  async setValue(key: string, value: any) {
    await this.config.set(key, value);
  }
}
```

---

## 💡 Tips

- 🔐 **Multiple connections:** Use the `name` property to manage several Redis instances or clusters.
- 🏷️ **Key prefixing:** Use `prefixKey` to avoid key collisions across different environments or apps.
- 🛑 **Watch mode:** Make sure your Redis server is configured with `notify-keyspace-events` for real-time updates (the package will auto-configure this when possible).
- 📚 **Validation:** Add a `validationSchema` to ensure your configs are always valid.

---

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [ioredis Documentation](https://github.com/redis/ioredis) 🐙
- [TestContainers Node.js](https://node.testcontainers.org/) 🐳

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
