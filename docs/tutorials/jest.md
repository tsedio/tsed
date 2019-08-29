---
meta:
 - name: description
   content: Use Jest with Ts.ED framework. Jest is a testing framework.
 - name: keywords
   content: ts.ed express typescript mongoose node.js javascript decorators
---
# Jest <Badge text="beta" type="warn"/> <Badge text="Contributors are welcome" />

<Banner src="https://camo.githubusercontent.com/b5639de5cfa97c51598b60b13a1061498afe2acb/68747470733a2f2f64337676366c703535716a6171632e636c6f756466726f6e742e6e65742f6974656d732f3244324b343533313278304d31713243306133502f6a6573742d6c6f676f2e737667" href="https://jestjs.io/" height="128" />

## Installation

To begin, install Ts.ED testing module:

```bash
npm i -D @tsed/testing
```

Then install `jest`:

```bash
npm i -D jest ts-jest @types/jest
```

## Configuration

Now you need to configure `jest` to work with Typescript.
To do that crate a new file in your project root called `jest.config.js` and put the following configuration in it:

```js
module.exports = {
    preset: "ts-jest",
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json"
        }
    },
    verbose: true,
    collectCoverage: true,
    moduleFileExtensions: ["ts", "js", "json"],
    testMatch: ["**/tests/**/*.test.ts"],
    testEnvironment: "node",
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/out/"
    ],
    modulePathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/out/"
    ],
    coverageDirectory: "tests/result",
    collectCoverageFrom: [
        "src/controllers/**/*.ts",
        "src/middlewares/**/*.ts",
        "src/services/**/*.ts",
        "!**/*.d.ts"
    ]
};
```

### **Important!!!**

The DI will not work unless you set the `TS_TEST` environment variable to `true` like this:

```json
{
    "scripts": {
        "test": "TS_TEST=true jest",
        "test:w": "TS_TEST=true jest --watch"
    }
}
```
