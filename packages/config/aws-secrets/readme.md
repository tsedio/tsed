<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
  <h1>Ts.ED - @tsed/config-source-aws-secrets</h1>

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

A powerful plugin for [Ts.ED](https://tsed.dev/) to manage your application configuration in AWS and sync changes in real time.

---

## ✨ Features

- ⚙️ **Configure AWS Secrets Manager** using the `@Configuration` decorator.
- 👀 **Watch secrets** and automatically notify your application of any changes.
- 🔄 **Sync configuration values** between your app and AWS, using AWS as a dynamic source of truth.
- 🛠️ **Flexible options:** Supports AWS Secrets Manager with customizable paths and prefixes.
- 🔒 **Validation schema:** Add a validation schema to ensure your configs are always valid.

For more information, check out the [official documentation](https://tsed.dev/).

---

## 📦 Installation

Install the package and its peer dependencies:

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

---

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

---

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

---

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

---

## 💡 Tips

- 🔐 **Multiple connections:** Use the `name` property to manage several AWS regions or paths.
- 🏷️ **Path prefixing:** Use `path` to organize parameters by environment or application.
- 🛑 **Watch mode:** Set an appropriate `watchInterval` based on your application's needs.
- 📚 **Validation:** Add a `validationSchema` to ensure your configs are always valid.

---

## 📚 Resources

- [Ts.ED Documentation](https://tsed.dev/) 📖
- [AWS SDK for JavaScript Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) 🐙
- [AWS Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) 🔧

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
