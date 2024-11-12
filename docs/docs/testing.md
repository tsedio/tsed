# Testing

## Unit test

### Installation

Ts.ED support officially two unit test frameworks: Jest, Mocha and Vitest. It's also possible to use your
preferred frameworks. Your feedback are welcome.

- Installation guide for [Jest](/tutorials/jest)
- Installation guide for [Vitest](/tutorials/vitest)

### Usage

Ts.ED provides @@PlatformTest@@ to create a new context to inject your Services, Controllers, Middlewares, etc...
registered with annotations like @@Injectable@@.

The process to test any components is the same thing:

- Create a new context for your unit test with `PlatformTest.create`,
- Inject or invoke your component with `PlatformTest.inject` or `PlatformTest.invoke`,
- Reset the context with `PlatformTest.reset`.

Here is an example to test the ParseService:

::: code-group

<<< @/docs/snippets/testing/parse-service.jest.spec.ts [jest]

<<< @/docs/snippets/testing/parse-service.vitest.spec.ts [vitest]

<<< @/docs/snippets/testing/parse-service.ts [ParserService.ts]

:::

### Async / Await

Testing asynchronous method is also possible using `Promises` (`async`/`await`):

::: code-group

<<< @/docs/snippets/testing/db-service-async-await.jest.ts [jest]

<<< @/docs/snippets/testing/db-service-async-await.vitest.ts [vitest]

:::

### Mock context

[Context](/docs/request-context.md) is a feature that allows you to store data in a global context during the request lifecycle.

Here is an example of context usage:

::: code-group
<<< @/docs/snippets/request-context/decorators/request-context-usage.ts [Decorators]
<<< @/docs/snippets/request-context/fn/request-context-usage.ts [Functional API]
:::

To run a method with context in your unit test, you can use the @@runInContext@@ function:

<<< @/docs/snippets/request-context/testing/request-context-usage.spec.ts

## Mock dependencies

### Using PlatformTest.invoke

PlatformTest API provides an `PlatformTest.invoke` method to create a new instance of your component with mocked dependencies during a test context created with `PlatformTest.create()`.
This method is useful when you want to mock dependencies for a specific test.

::: code-group

<<< @/docs/snippets/testing/db-service-mock-dependencies.jest.ts [jest]

<<< @/docs/snippets/testing/db-service-mock-dependencies.vitest.ts [vitest]

:::

::: tip
`PlatformTest.invoke()` executes automatically the `$onInit` hook!
:::

### Using PlatformTest.create

If you want to mock dependencies for all your tests, you can use the `PlatformTest.create()` method.
it useful if you have a service that execute a code in his constructor.

::: code-group

<<< @/docs/snippets/testing/db-service-mock-dependencies-create.jest.ts [jest]

<<< @/docs/snippets/testing/db-service-mock-dependencies-create.vitest.ts [vitest]

:::

## Test your Rest API

### Installation

To test your API, I recommend you to use the [`supertest`](https://github.com/visionmedia/supertest) module.

To install supertest just run these commands:

::: code-group

```sh [npm]
npm install --save-dev supertest @types/supertest
```

```sh [yarn]
yarn add -D supertest @types/supertest
```

```sh [pnpm]
pnpm add -D supertest @types/supertest
```

```sh [bun]
bun add -D supertest @types/supertest
```

:::

### Example

::: code-group

```ts [jest]
import {PlatformTest} from "@tsed/platform-http/testing";
import * as SuperTest from "supertest";
import {Server} from "../Server.js";

describe("Rest", () => {
  beforeAll(PlatformTest.bootstrap(Server));
  afterAll(PlatformTest.reset);

  describe("GET /rest/calendars", () => {
    it("should do something", async () => {
      const request = SuperTest(PlatformTest.callback());
      const response = await request.get("/rest/calendars").expect(200);

      expect(typeof response.body).toEqual("array");
    });
  });
});
```

```ts [vitest]
import {it, expect, describe, beforeAll, afterAll} from "vitest";
import {PlatformTest} from "@tsed/platform-http/testing";
import * as SuperTest from "supertest";
import {Server} from "../Server.js";

describe("Rest", () => {
  beforeAll(PlatformTest.bootstrap(Server));
  afterAll(PlatformTest.reset);

  describe("GET /rest/calendars", () => {
    it("should do something", async () => {
      const request = SuperTest(PlatformTest.callback());
      const response = await request.get("/rest/calendars").expect(200);

      expect(typeof response.body).toEqual("array");
    });
  });
});
```

:::

::: warning
If you use the PlatformTest, you'll probably get an error when you'll run the unit test:

```
Platform type is not specified. Have you added at least `import @tsed/platform-express` (or equivalent) on your Server.ts ?
```

To solve it, just add the `import @tsed/platform-express` on your `Server.ts`. PlatformTest need this import to know on
which Platform
your server must be executed for integration test.
:::

## Pros / Cons

::: warning
Use `PlatformTest.boostrap()` is not recommended in Jest environment.  
This method is practical for carrying out some integration tests but consumes a lot of resources which can lead to a significant slowdown in your tests or even cause timeouts.

It's better to write your tests using Cucumber and test your Rest applications in a container.
:::

::: tip Note
There is no performance issue as long as you use `PlatformTest.create()` to perform your tests,
But it's not possible with this method to do an integration test with the server (Express or Koa). You can only test your controller and the services injected into it.
:::

### Stub a service method

When you're testing your API, you have sometimes to stub a method of a service.

Here is an example to do that:

::: code-group

```typescript [jest]
import {PlatformTest} from "@tsed/platform-http/testing";
import SuperTest from "supertest";
import {Server} from "../../Server";
import {Chapter} from "../../entity/Chapter";

const entity = new Chapter();
Object.assign(entity, {
  id: 2,
  bookId: 4,
  timestamp: 1650996201,
  name: "First Day At Work"
});

describe("ChapterController", () => {
  beforeAll(PlatformTest.bootstrap(Server));
  afterAll(PlatformTest.reset);

  describe("GET /rest/chapter", () => {
    it("Get All Chapters", async () => {
      const service = PlatformTest.get(ChapterService);

      jest.spyOn(service, "findChapters").mockResolvedValue([entity]);

      const request = SuperTest(PlatformTest.callback());

      const response = await request.get("/rest/chapter").expect(200);
      expect(typeof response.body).toEqual("object");
    });
  });
});
```

```typescript [vitest]
import {it, expect, describe, beforeAll, afterAll} from "vitest";
import {PlatformTest} from "@tsed/platform-http/testing";
import SuperTest from "supertest";
import {Server} from "../../Server.js";
import {Chapter} from "../../entity/Chapter.js";

const entity = new Chapter();
Object.assign(entity, {
  id: 2,
  bookId: 4,
  timestamp: 1650996201,
  name: "First Day At Work"
});

describe("ChapterController", () => {
  beforeAll(PlatformTest.bootstrap(Server));
  afterAll(PlatformTest.reset);

  describe("GET /rest/chapter", () => {
    it("Get All Chapters", async () => {
      const service = PlatformTest.get(ChapterService);

      jest.spyOn(service, "findChapters").mockResolvedValue([entity]);

      const request = SuperTest(PlatformTest.callback());

      const response = await request.get("/rest/chapter").expect(200);
      expect(typeof response.body).toEqual("object");
    });
  });
});
```

:::

### Stub a middleware method <Badge text="6.114.3+" />

When you're testing your API, you have sometimes to stub middleware to disable authentication for example.

Here is an example to do that:

::: code-group

```typescript [jest]
import {PlatformTest} from "@tsed/platform-http/testing";
import SuperTest from "supertest";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {HelloWorldController} from "./HelloWorldController.js";
import {Server} from "../../Server.js";
import {AuthMiddleware} from "../../middlewares/auth.middleware.js";

describe("HelloWorldController", () => {
  beforeAll(async () => {
    await TestMongooseContext.bootstrap(Server)();

    const authMiddleware = PlatformTest.get<AuthMiddleware>(AuthMiddleware);
    jest.spyOn(authMiddleware, "use").mockResolvedValue(true);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(TestMongooseContext.reset);

  it("should return value", async () => {
    const request = SuperTest(PlatformTest.callback());
    const response = await request.get("/rest/hello-world").expect(200);
    expect(response.text).toEqual("hello");
  });
});
```

```typescript [vitest]
import {it, expect, describe, beforeAll, afterAll, beforeEach} from "vitest";
import {PlatformTest} from "@tsed/platform-http/testing";
import SuperTest from "supertest";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {HelloWorldController} from "./HelloWorldController.js";
import {Server} from "../../Server.js";
import {AuthMiddleware} from "../../middlewares/auth.middleware.js";

describe("HelloWorldController", () => {
  beforeAll(async () => {
    await TestMongooseContext.bootstrap(Server)();

    const authMiddleware = PlatformTest.get<AuthMiddleware>(AuthMiddleware);
    jest.spyOn(authMiddleware, "use").mockResolvedValue(true);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(TestMongooseContext.reset);

  it("should return value", async () => {
    const request = SuperTest(PlatformTest.callback());
    const response = await request.get("/rest/hello-world").expect(200);
    expect(response.text).toEqual("hello");
  });
});
```

:::

## Testing session

To install session with Ts.ED see our [documentation page](/docs/session.md).

::: code-group

<<< @/docs/snippets/testing/session.jest.ts [jest]

<<< @/docs/snippets/testing/session.vitest.ts [vitest]

:::

## Testing with mocked service <Badge text="v7.4.0" />

One inconvenient with `PlatformTest.bootstrap()` and `PlatformTest.create()`
is that they will always call the hooks of your service like for example `$onInit()`.

::: tip Note
`PlatformTest.create()` call only the `$onInit()` hook while `PlatformTest.bootstrap()` call all hooks.
:::

This is going to be a problem when you want to test your application, and it uses `$onInit` to initialize your database or something else.

Since v7.4.0, You can now mock one or more services as soon as the PlatformTest context is created (like is possible with `PlatformTest.invoke`).

Here is an example:

```typescript
import {MyCtrl} from "../controllers/MyCtrl";
import {DbService} from "../services/DbService";

describe("MyCtrl", () => {
  // bootstrap your Server to load all endpoints before run your test
  beforeEach(() =>
    PlatformTest.create({
      imports: [
        {
          token: DbService,
          use: {
            getData: () => {
              return "test";
            }
          }
        }
      ]
    })
  );
  afterEach(() => PlatformTest.reset());
});
```

It's also possible to do that with `PlatformTest.bootstrap()`:

```typescript
import {PlatformTest} from "@tsed/platform-http/testing";
import SuperTest from "supertest";
import {Server} from "../../Server";

describe("SomeIntegrationTestWithDB", () => {
  beforeAll(
    PlatformTest.bootstrap(Server, {
      imports: [
        {
          token: DbService,
          use: {
            getData: () => {
              return "test";
            }
          }
        }
      ]
    })
  );
  afterAll(PlatformTest.reset);
});
```
