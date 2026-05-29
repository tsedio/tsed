<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>TestContainers LocalStack</h1>

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

A package for the [Ts.ED](https://tsed.dev/) framework to help you test your code using the [TestContainers](https://node.testcontainers.org/) library with [LocalStack](https://localstack.cloud/).

> **Note**: This package does **not** depend on `@tsed/platform-http`. You can use it with any test framework.

---

## ✨ Features

- 🚀 **Spin up a LocalStack server** using TestContainers for your tests
- 🛑 **Automatically stop** the LocalStack server after your tests
- 🔧 **Configure AWS services** to use in your tests
- 🌐 **Set environment variables** for AWS SDK to use LocalStack

---

## 📦 Installation

Install with your favorite package manager:

```sh npm
npm install --save-dev @tsed/testcontainers-localstack @testcontainers/localstack
```

```sh yarn
yarn add --dev @tsed/testcontainers-localstack @testcontainers/localstack
```

```sh pnpm
pnpm add --dev @tsed/testcontainers-localstack @testcontainers/localstack
```

```sh bun
bun add --dev @tsed/testcontainers-localstack @testcontainers/localstack
```

This package uses `@testcontainers/localstack` which provides a specialized container for LocalStack.

---

## ⚙️ Configuration

Set up a global test lifecycle to manage the LocalStack container.

### 🧪 Vitest

Add a global setup file in your `vitest.config.ts`:

```ts
import {defineConfig} from "vitest/config";
import {localstackPlugin} from "@tsed/testcontainers-localstack/vitest/plugin";

export default defineConfig({
  plugins: [
    localstackPlugin({
      // Optional: image name (defaults to "localstack/localstack:latest")
      image: "localstack/localstack:latest",
      // Optional: specify services to start
      services: ["s3", "dynamodb", "lambda"],
      // Optional: specify default region
      defaultRegion: "us-east-1",
      // Optional: specify edge port
      edgePort: 4566
    })
  ],
  test: {}
});
```

---

## 🚀 Usage

### Basic Usage

```ts
import {TestContainersLocalstack} from "@tsed/testcontainers-localstack";
import {ListBucketsCommand, S3Client} from "@aws-sdk/client-s3";

describe("S3 Tests", () => {
  let s3Client: S3Client;

  beforeEach(async () => {
    // Create an S3 client that points to LocalStack
    s3Client = new S3Client({
      endpoint: TestContainersLocalstack.getUrl(),
      region: "us-east-1",
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test"
      },
      forcePathStyle: true
    });
  });
  afterEach(async () => {
    // Clean up any resources
    try {
      await s3Client.send(new DeleteBucketCommand({Bucket: bucketName}));
    } catch (error) {
      // Ignore errors if bucket doesn't exist
    }
  });

  it("should list buckets", async () => {
    const response = await s3Client.send(new ListBucketsCommand({}));
    expect(response.Buckets).toBeDefined();
  });
});
```

### Environment Variables

The following environment variables are automatically set when the container starts:

- `LOCALSTACK_URL`: The URL of the LocalStack container
- `AWS_ENDPOINT`: The URL of the LocalStack container (for AWS SDK)
- `AWS_ACCESS_KEY_ID`: Set to "test"
- `AWS_SECRET_ACCESS_KEY`: Set to "test"
- `AWS_REGION`: The default region (defaults to "us-east-1")

---

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
