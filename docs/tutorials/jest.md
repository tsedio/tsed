# Jest

## Introduction

This guide will take you through the process of installing Jest, a popular JavaScript testing framework, on an existing
Ts.ED project. Jest provides a comprehensive solution for testing JavaScript and TypeScript code, and it integrates
seamlessly with Ts.ED. Follow the steps below to incorporate Jest into your project.

## Installation

Open your project's terminal where you usually run npm commands.
Run the following npm command to install Jest and its required dependencies:

<Tabs class="-code">
  <Tab label="Npm">

```bash
$ npm install --save-dev jest ts-jest @types/jest
```

  </Tab>
  <Tab label="Yarn">

```bash
$ yarn add -D jest ts-jest @types/jest
```

  </Tab>
  <Tab label="PNPM">

```bash
$ pnpm add -D jest ts-jest @types/jest
```

  </Tab>
  <Tab label="Bun">

```bash
$ bun add -D jest ts-jest @types/jest
```

  </Tab>
</Tabs>

This command installs Jest, the TypeScript Jest transformer (`ts-jest`), and the Jest TypeScript types.

## Create Jest Configuration

Create a Jest configuration file named `jest.config.ts` at the root of your project. Copy and paste the following
content into the file:

```javascript
export default {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ["index.ts", "/node_modules/"],

  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/src/**/__tests__/**/*.[jt]s?(x)", "**/src/**/?(*.)+(spec|test).[tj]s?(x)"],
  // A map from regular expressions to paths to transformers
  transform: {
    "\\.(ts)$": "ts-jest"
  }
};
```

This configuration file specifies Jest settings for TypeScript, including the test file patterns, transformation rules,
and other essential configurations.

## Update `package.json` with Test Scripts

Add the following example of test scripts to your `package.json` file:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./jest.config.e2e.js"
  }
}
```

These scripts allow you to run various Jest commands, such as running tests, watching for changes, generating coverage
reports, debugging tests, and running end-to-end tests with a custom configuration.

Congratulations! You have successfully integrated Jest into your existing Ts.ED project, and you're ready to leverage
the provided scripts for efficient testing.
