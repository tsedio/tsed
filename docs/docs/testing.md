# Testing

## Unit test
### Installation

All following examples are based on `mocha + chai` testing framework. Obviously, you can use another framework like Jasmine !
To install mocha and chai just run these commands:

```
npm install --save-dev mocha chai @types/mocha @types/chai
```

### Usage

Ts.ED is bundled with a testing module `@tsed/testing`.
This module provides @@TestContext@@ to create a new context and `inject` function to inject your Services, Controllers, Middlewares, etc... registered with annotations like @@Service@@.

The process to test any components is the same thing:

- Create a new context for your unit test with `TestContext.create`,
- Inject or invoke your component with `TestContext.inject` or `TestContext.invoke`,
- Reset the context with `TestContext.reset`.

Here is an example to test the ParseService:

<<< @/docs/docs/snippets/testing/parse-service.ts

### Async / Await

Testing asynchronous method is also possible using `Promises` (`async`/`await`):

<<< @/docs/docs/snippets/testing/db-service-async-await.ts

### Mock dependencies

TestContext API provides an `invoke` method to create a new instance of your component with mocked dependencies.

<<< @/docs/docs/snippets/testing/db-service-mock-dependencies.ts

::: tip
`TestContext.invoke()` executes automatically the `$onInit` hook!
:::

## Test your Rest API
### Installation

To test your API, I recommend you to use the [`supertest`](https://github.com/visionmedia/supertest) module.

To install supertest just run these commands:

```bash
npm install --save-dev supertest @types/supertest
```

### Example

<<< @/docs/docs/snippets/testing/supertest.ts

### Disable Logs

If you would like to disable logs output for any reason, you can do it by calling `$log.level` or `$log.stop()`.
It's useful to remove logging during unit tests runs so that your passed/failed tests summary does not get polluted with information.

```typescript
import { $log } from "@tsed/logger";

describe('A test that will not print logs :', () => {

    before(() => {
        $log.level = "OFF"
    });

    /* you tests here */
});
```

## Utils (recommended)

In addition, you can use some libraries like Sinon and Chai-promised for your unit tests. To help you, here is the `tools.ts` code used by the unit tests for Ts.ED:

<Gist repo="Romakita" id="a95fe9d491f453d038b5bec0cbe72e8f" filename="tools.ts"></Gist>
