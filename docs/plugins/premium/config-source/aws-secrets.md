---
head:
  - - meta
    - name: description
      content: A powerful plugin for Ts.ED to manage your application configuration with AWS Secrets manager and sync changes in real time.
  - - meta
    - name: keywords
      content: Ts.ED plugins premium aws config-source secrets manager watch-mode hot-reload
---

# AWS Secrets Config Source

<Banner src="/aws.png" height="200" href="https://docs.aws.amazon.com/en_us/secretsmanager/latest/userguide/intro.html"></Banner>

A powerful plugin for [Ts.ED](https://tsed.dev/) to manage your application configuration in AWS and sync changes in
real time.

## ✨ Features

- ⚙️ **Configure AWS Secrets Manager** using the `@Configuration` decorator.
- 👀 **Watch secrets** and automatically notify your application of any changes.
- 🔄 **Sync configuration values** between your app and AWS, using AWS as a dynamic source of truth.
- 🛠️ **Flexible options:** Supports AWS Secrets Manager with customizable paths and prefixes.
- 🔒 **Validation schema:** Add a validation schema to ensure your configs are always valid.

For more details on the @@ConfigSource@@ feature, go
to [Configuration Source documentation page](/docs/configuration/configuration-sources.md).

## 📦 Installation

Install the package and its peer dependencies:

::: code-group

```sh [npm]
npm install --save @tsedio/config-source-aws-secrets
npm install --save @tsed/config @aws-sdk/client-secrets-manager
```

```sh [yarn]
yarn add @tsedio/config-source-aws-secrets
yarn add @tsed/config @aws-sdk/client-secrets-manager
```

```sh [pnpm]
pnpm add @tsedio/config-source-aws-secrets
pnpm add @tsed/config @aws-sdk/client-secrets-manager
```

```sh [bun]
bun add @tsedio/config-source-aws-secrets
bun add @tsed/config @aws-sdk/client-secrets-manager
```

:::

::: warning
See our documentation page for instructions
on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

## ⚙️ Configuration Example

Configure the AWS Secrets Manager source in your Ts.ED application:

```typescript
import {withOptions} from "@tsed/config";
import {AWSConfigSource} from "@tsedio/config-source-aws-secrets";
import {Configuration, Constant} from "@tsed/di";

@Configuration({
  extends: [
    withOptions(AWSConfigSource, {
      name: "aws",
      path: "/my-app/config", // Path prefix in Secrets Manager
      region: "us-east-1", // AWS region
      watch: true // Enable secrets watching
      // validationSchema: object({}) // Optional: add a validation schema
      // maxConcurrency: 10
    })
  ]
})
export class Server {
  @Constant("configs.aws")
  config: Record<string, any>;
}
```

## 👀 Watching Secrets

Enable secrets watching to keep your app config in sync with AWS Secrets Manager in real time:

```typescript
@Configuration({
  extends: [
    withOptions(AWSConfigSource, {
      name: "aws",
      path: "/my-app/config",
      region: "us-east-1",
      watch: true, // 👈 Enable secrets watching!
      refreshInterval: 30000 // Check for updates every 30 seconds (default: 60000)
    })
  ]
})
export class Server {
  @Constant("configs.aws")
  config: Record<string, any>;
}
```

## ✏️ Set Configuration Values Programmatically

You can update configuration values in AWS Secrets Manager directly from your services, using dependency injection:

```typescript
import {AWSConfigSource} from "@tsedio/config-source-aws-secrets";
import {InjectConfigSource} from "@tsed/config/decorators/injectConfigSource.js";
import {Injectable} from "@tsed/di";

@Injectable()
class MyService {
  @InjectConfigSource("aws")
  config: AWSConfigSource;

  async setValue(key: string, value: any) {
    await this.config.set(key, value);
  }
}
```

## 💡 Tips

- 🔐 **Multiple connections:** Use the `name` property to manage several AWS regions or paths.
- 🏷️ **Path prefixing:** Use `path` to organize parameters by environment or application.
- 🛑 **Watch mode:** Set an appropriate `watchInterval` based on your application's needs.
- 📚 **Validation:** Add a `validationSchema` to ensure your configs are always valid.

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [AWS SDK for JavaScript Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) 🐙
- [AWS Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) 🔧
