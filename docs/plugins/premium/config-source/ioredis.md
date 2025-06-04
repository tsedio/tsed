---
head:
  - - meta
    - name: description
      content: A powerful plugin for Ts.ED to manage your application configuration in Redis and sync changes in real time.
  - - meta
    - name: keywords
      content: Ts.ED plugins premium ioredis config-source redis watch-mode hot-reload
---

# IORedis Config Source

<Banner src="/ioredis.svg" height="200" href="https://github.com/luin/ioredis"></Banner>

A powerful plugin for [Ts.ED](https://tsed.dev/) to manage your application configuration in Redis and sync changes in
real time.

## ✨ Features

- ⚙️ **Configure one or more Redis connections** using the @@Configuration@@ decorator.
- 👀 **Watch Redis keys** and automatically notify your application of any changes.
- 🔄 **Sync configuration values** between your app and Redis, using Redis as a dynamic source of truth.
- 🛠️ **Flexible options:** Supports standard Redis, Redis Cluster, and custom key prefixing.
- 🔒 **Validation schema:** Add a validation schema to ensure your configs are always valid.

For more details on the @@ConfigSource@@ feature, go
to [Configuration Source documentation page](/docs/configuration/configuration-sources.md).

## 📦 Installation

Install the package and its peer dependencies:

::: code-group

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

:::

::: warning
See our documentation page for instructions
on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

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

## ✏️ Set Configuration Values Programmatically

You can update configuration values in Redis directly from your services, using dependency injection.

::: code-group

```typescript [Decorators]
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

```typescript [Functional API]
import {IORedisConfigSource} from "@tsed/ioredis-config";
import {injectConfigSource} from "@tsed/config/fn/injectConfigSource.js";
import {injectable} from "@tsed/di";

class MyService {
  config = injectConfigSource<IORedisConfigSource>("redis");

  async setValue(key: string, value: any) {
    await this.config.set(key, value);
  }
}

injectable(MyService);
```

:::

## 💡 Tips

- 🔐 **Multiple connections:** Use the `name` property to manage several Redis instances or clusters.
- 🏷️ **Key prefixing:** Use `prefixKey` to avoid key collisions across different environments or apps.
- 🛑 **Watch mode:** Make sure your Redis server is configured with `notify-keyspace-events` for real-time updates (the
  package will auto-configure this when possible).
- 📚 **Validation:** Add a `validationSchema` to ensure your configs are always valid.

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [ioredis Documentation](https://github.com/redis/ioredis) 🐙
- [TestContainers Node.js](https://node.testcontainers.org/) 🐳
