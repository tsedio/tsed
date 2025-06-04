# LocalStack TestContainers

A package for the [Ts.ED](https://tsed.dev/) framework to help you test your code using
the [TestContainers](https://node.testcontainers.org/) library with [LocalStack](https://localstack.cloud/).

> **Note**: This package does **not** depend on `@tsed/platform-http`. You can use it with any test framework.

## ✨ Features

- 🚀 **Spin up a LocalStack server** using TestContainers for your tests
- 🛑 **Automatically stop** the LocalStack server after your tests
- 🔧 **Configure AWS services** to use in your tests
- 🌐 **Set environment variables** for AWS SDK to use LocalStack

## 📦 Installation

Install with your favorite package manager:

::: code-group

```sh [npm]
npm install --save-dev @tsed/testcontainers-localstack @testcontainers/localstack
```

```sh [yarn]
yarn add --dev @tsed/testcontainers-localstack @testcontainers/localstack
```

```sh [pnpm]
pnpm add --dev @tsed/testcontainers-localstack @testcontainers/localstack
```

```sh [bun]
bun add --dev @tsed/testcontainers-localstack @testcontainers/localstack
```

:::

This package uses `@testcontainers/localstack` which provides a specialized container for LocalStack.

::: warning
See our documentation page for instructions
on [installing premium plugins](/plugins/premium/install-premium-plugins.md).
:::

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

## 🚀 Usage

### Basic Usage

```ts
import {TestContainersLocalstack} from "@tsed/testcontainers-localstack";
import {ListBucketsCommand, S3Client, DeleteBucketCommand} from "@aws-sdk/client-s3";

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
      await s3Client.send(new DeleteBucketCommand({Bucket: "bucketName"}));
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
