# Vitest

## Introduction

This guide will take you through the process of installing Vitest, a testing framework, on an existing Ts.ED project.
Vitest is designed to work seamlessly with Ts.ED, providing a simple and efficient way to run tests for your TypeScript
code. Follow the steps below to integrate Vitest into your project.

## Installation

Open your project's terminal where you usually run npm commands.
Run the following npm command to install Vitest and its required dependencies:

::: code-group

```bash [npm]
$ npm i --save-dev vitest unplugin-swc @swc/core @vitest/coverage-v8
```

```bash [yarn]
$ yarn add -D vitest unplugin-swc @swc/core @vitest/coverage-v8
```

```bash [pnpm]
$ pnpm add -D vitest unplugin-swc @swc/core @vitest/coverage-v8
```

```bash [bun]
$ bun add -D vitest unplugin-swc @swc/core @vitest/coverage-v8
```

:::

This command installs Vitest, the SWC plugin for Vite, and the V8 coverage tool for Vitest.

## Create `vitest.config.ts`

Create a new configuration file named `vitest.config.ts` at the root of your project. Copy and paste the following
content into the file:

```typescript
// vitest.config.ts
import swc from "unplugin-swc";
import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    root: "./"
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      sourceMaps: "inline",

      jsc: {
        target: "es2022",
        externalHelpers: true,
        keepClassNames: true,
        parser: {
          syntax: "typescript",
          tsx: true,
          decorators: true,
          dynamicImport: true,
          importMeta: true,
          preserveAllComments: true
        },
        transform: {
          useDefineForClassFields: false,
          legacyDecorator: true,
          decoratorMetadata: true
        }
      },
      module: {
        type: "es6",
        strictMode: true,
        lazy: false,
        noInterop: false
      },
      isModule: true
    })
  ]
});
```

This configuration file specifies the testing globals and includes the necessary SWC plugin configuration for running
test files.

## Update `package.json` with Test Scripts

Add the following example of test scripts to your `package.json` file:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:debug": "vitest --inspect-brk --inspect --logHeapUsage --threads=false"
  }
}
```

These scripts allow you to run various Vitest commands, such as running tests, watching for changes, generating coverage
reports, debugging tests, and running end-to-end tests with a custom configuration.

Congratulations! You have successfully integrated Vitest into your existing Ts.ED project, and you're ready to leverage
the provided scripts for efficient testing.
