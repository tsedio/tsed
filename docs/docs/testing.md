---
head:
  - - meta
    - name: description
      content: Learn how to test your Ts.ED application with Jest and Vitest.
  - - meta
    - name: keywords
      content: testing ts.ed jest vitest unit integration e2e rest api request context
---

# Testing

## Unit test

### Installation

Ts.ED support officially two unit test frameworks: Jest, Mocha and Vitest. It's also possible to use your
preferred frameworks. Your feedback are welcome.

- Installation guide for [Vitest](/tutorials/vitest)
- Installation guide for [Jest](/tutorials/jest) (unstable with ESM)

### Usage

Ts.ED provides @@PlatformTest@@ to create a new context to inject your Services, Controllers, Middlewares, etc...
registered with annotations like @@Injectable@@.

The process to test any components is the same thing:

- Create a new context for your unit test with `PlatformTest.create`,
- Inject or invoke your component with `PlatformTest.inject` or `PlatformTest.invoke`,
- Reset the context with `PlatformTest.reset`.

Here is an example to test the ParseService:

::: code-group

<<< @/docs/snippets/testing/parse-service.vitest.spec.ts [vitest]

<<< @/docs/snippets/testing/parse-service.jest.spec.ts [jest]

<<< @/docs/snippets/testing/parse-service.ts [ParserService.ts]

:::

### Async / Await

Testing asynchronous method is also possible using `Promises` (`async`/`await`):

::: code-group

<<< @/docs/snippets/testing/db-service-async-await.vitest.ts [vitest]

<<< @/docs/snippets/testing/db-service-async-await.jest.ts [jest]

:::

### Mock context

[Context](/docs/request-context.md) is a feature that allows you to store data in a global context during the request
lifecycle.

Here is an example of context usage:

::: code-group
<<< @/docs/snippets/request-context/decorators/request-context-usage.ts [Decorators]
<<< @/docs/snippets/request-context/fn/request-context-usage.ts [Functional API]
:::

To run a method with context in your unit test, you can use the @@runInContext@@ function:

::: code-group
<<< @/docs/snippets/request-context/fn/request-context-usage.ts [v7/v8]
<<< @/docs/snippets/request-context/testing/request-context-usage.spec.ts [Test]
:::

## Mock dependencies

### Using PlatformTest.invoke

PlatformTest API provides an `PlatformTest.invoke` method to create a new instance of your component with mocked
dependencies during a test context created with `PlatformTest.create()`.
This method is useful when you want to mock dependencies for a specific test.

::: code-group

<<< @/docs/snippets/testing/db-service-mock-dependencies.vitest.ts [vitest]

<<< @/docs/snippets/testing/db-service-mock-dependencies.jest.ts [jest]

:::

::: tip
`PlatformTest.invoke()` executes automatically the `$onInit` hook!
:::

### Using PlatformTest.create

If you want to mock dependencies for all your tests, you can use the `PlatformTest.create()` method.
it useful if you have a service that execute a code in his constructor.

::: code-group

<<< @/docs/snippets/testing/db-service-mock-dependencies-create.vitest.ts [vitest]

<<< @/docs/snippets/testing/db-service-mock-dependencies-create.jest.ts [jest]

:::

## Unit-testing injectable services: best practices

The repository contains many good service unit tests. Use these patterns to keep tests fast and readable.

### 1. Choose the right test entrypoint

- `inject(MyService)`:
  Use when no local overrides are needed.
- `await PlatformTest.invoke(MyService, locals)`:
  Use when one test needs custom mocked dependencies.
- `PlatformTest.inject([MyService], (service) => {})`:
  Prefer avoiding this style in new tests. Keep it only for legacy callback-style cases.

### Which tool to choose?

| Need                                                      | Recommended tool                                              | Why                                        |
| --------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------ |
| Resolve one injectable service with container defaults    | `inject(MyService)`                                           | Most direct and readable                   |
| Override one or more dependencies only for one test       | `await PlatformTest.invoke(MyService, locals)`                | Local mocks, no global side effects        |
| Override dependencies for all tests in a `describe` block | `PlatformTest.create({imports: [...]})` + `inject(MyService)` | Shared setup, less duplication             |
| Test callback-based legacy flow                           | `await PlatformTest.invoke(MyService)` + Promise wrapper      | Works with modern `async/await` assertions |

### 2. Keep strict setup/teardown

Always isolate each test:

```ts
beforeEach(() => PlatformTest.create());
afterEach(() => PlatformTest.reset());
```

### 3. Mock only direct collaborators

Mock only dependencies injected into the tested service, then assert both:

- result returned by the service,
- calls made to mocked collaborators (`toHaveBeenCalledWith`).

`PlatformTest.invoke()` with locals is usually the cleanest pattern for this.

### 4. Cover success and error paths

For async services, test at least:

- one successful flow (`mockResolvedValue`),
- one failing flow (`mockRejectedValue` or thrown error).

If the API is callback-based, wrap it in a Promise in the test to keep `async/await` style.

### 5. Use focused assertions

- Assert business output first.
- Assert one important interaction per expectation block.
- Avoid snapshot-only assertions for business logic; prefer explicit field/value checks.

## Real examples from this codebase

### Injectable service with `PlatformTest.invoke()` and local overrides

::: code-group

```ts [Test (vitest)]
import {Injectable} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {FormioDatabase} from "./FormioDatabase.js";
import {FormioRepository} from "./FormioRepository.js";

@Injectable()
class PackagesRepository extends FormioRepository {
  formName = "package";
}

describe("FormioRepository", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should resolve form id then query submissions", async () => {
    const database = {
      formModel: {
        findOne: vi.fn().mockResolvedValue({_id: "id"})
      },
      getSubmissions: vi.fn().mockResolvedValue([])
    };

    const service = await PlatformTest.invoke(PackagesRepository, [
      {
        token: FormioDatabase,
        use: database
      }
    ]);

    const submissions = await service.getSubmissions();

    expect(submissions).toEqual([]);
    expect(database.formModel.findOne).toHaveBeenCalledWith({
      name: {$eq: "package"}
    });
    expect(database.getSubmissions).toHaveBeenCalledWith({form: "id"});
  });
});
```

```ts [Service]
import {Inject} from "@tsed/di";

export class FormioRepository {
  @Inject(FormioDatabase)
  protected database: FormioDatabase;

  formName = "default";

  async getSubmissions() {
    const form = await this.database.formModel.findOne({
      name: {$eq: this.formName}
    });

    return this.database.getSubmissions({form: form._id});
  }
}
```

:::

### Injectable service resolved with `inject()` + module mock

::: code-group

```ts [Test (vitest)]
import {writeFile} from "node:fs/promises";
import {inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {OpenAPIService} from "../index.js";

vi.mock("node:fs/promises");

describe("OpenAPIService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should write generated spec to disk", async () => {
    const service = inject(OpenAPIService);

    await service.writeOpenAPISpec({specVersion: "3.0.1", outFile: "/path"} as any);

    expect(writeFile).toHaveBeenCalledWith("/path", expect.any(String), {
      encoding: "utf8"
    });
  });
});
```

```ts [Service]
import {writeFile} from "node:fs/promises";
import {Injectable} from "@tsed/di";

@Injectable()
export class OpenAPIService {
  async writeOpenAPISpec(options: {specVersion: string; outFile: string}) {
    const spec = {
      openapi: options.specVersion,
      info: {title: "API", version: "1.0.0"}
    };

    await writeFile(options.outFile, JSON.stringify(spec, null, 2), {
      encoding: "utf8"
    });
  }
}
```

:::

### Legacy callback API wrapped in Promise (error path included)

::: code-group

```ts [Test (vitest)]
import {PlatformTest} from "@tsed/platform-http/testing";
import {PassportSerializerService} from "../index.js";

describe("PassportSerializerService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should deserialize payload", async () => {
    const service = await PlatformTest.invoke(PassportSerializerService);

    const result = await new Promise((resolve) =>
      service.deserialize('{"id":"id","email":"email@email.fr"}', (...args: any[]) => resolve(args))
    );

    expect(result).toEqual([null, {id: "id", email: "email@email.fr"}]);
  });

  it("should return an error for invalid payload", async () => {
    const service = await PlatformTest.invoke(PassportSerializerService);

    const result: any = await new Promise((resolve) =>
      service.deserialize('{"id":"id","email":"email@email.fr}', (...args: any[]) => resolve(args))
    );

    expect(result[0]).toBeInstanceOf(Error);
  });
});
```

```ts [Service]
import {Injectable} from "@tsed/di";

@Injectable()
export class PassportSerializerService {
  serialize(user: {id: string; email: string; password?: string}, done: (err: any, value?: string) => void) {
    const {id, email} = user;
    done(null, JSON.stringify({id, email}));
  }

  deserialize(payload: string, done: (err: any, value?: any) => void) {
    try {
      done(null, JSON.parse(payload));
    } catch (er) {
      done(er);
    }
  }
}
```

:::

### Injectable service with config token

::: code-group

```ts [Test (vitest)]
import {Inject, Injectable, TokenProvider, inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

const CACHE_OPTIONS = "cache.options";

@Injectable()
class CachePolicyService {
  @Inject(CACHE_OPTIONS)
  protected options: TokenProvider<{ttl: number}>;

  ttl() {
    return this.options.value.ttl;
  }
}

describe("CachePolicyService", () => {
  beforeEach(() =>
    PlatformTest.create({
      imports: [
        {
          token: CACHE_OPTIONS,
          useValue: {ttl: 120}
        }
      ]
    })
  );
  afterEach(() => PlatformTest.reset());

  it("should read ttl from injected token", () => {
    const service = inject(CachePolicyService);

    expect(service.ttl()).toBe(120);
  });
});
```

```ts [Service]
import {Inject, Injectable, TokenProvider} from "@tsed/di";

export const CACHE_OPTIONS = "cache.options";

@Injectable()
export class CachePolicyService {
  @Inject(CACHE_OPTIONS)
  protected options: TokenProvider<{ttl: number}>;

  ttl() {
    return this.options.value.ttl;
  }
}
```

:::

### Override config values with `PlatformTest.create()` + `constant()`

::: code-group

```ts [Test (vitest)]
import {Injectable, constant, inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

@Injectable()
class FeatureFlagService {
  isEnabled() {
    return constant<boolean>("features.newCheckout", false);
  }
}

describe("FeatureFlagService", () => {
  afterEach(() => PlatformTest.reset());

  it("should read enabled flag from test config", async () => {
    await PlatformTest.create({
      features: {
        newCheckout: true
      }
    });

    const service = inject(FeatureFlagService);

    expect(service.isEnabled()).toBe(true);
  });

  it("should support another value in another test", async () => {
    await PlatformTest.create({
      features: {
        newCheckout: false
      }
    });

    const service = inject(FeatureFlagService);

    expect(service.isEnabled()).toBe(false);
  });
});
```

```ts [Service]
import {Injectable, constant} from "@tsed/di";

@Injectable()
export class FeatureFlagService {
  isEnabled() {
    return constant<boolean>("features.newCheckout", false);
  }
}
```

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
This method is practical for carrying out some integration tests but consumes a lot of resources which can lead to a
significant slowdown in your tests or even cause timeouts.

It's better to write your tests using Cucumber and test your Rest applications in a container.
:::

::: tip Note
There is no performance issue as long as you use `PlatformTest.create()` to perform your tests,
But it's not possible with this method to do an integration test with the server (Express or Koa). You can only test
your controller and the services injected into it.
:::

### Stub a service method

When you're testing your API, you have sometimes to stub a method of a service.

Here is an example to do that:

::: code-group

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

:::

### Stub a middleware method <Badge text="6.114.3+" />

When you're testing your API, you have sometimes to stub middleware to disable authentication for example.

Here is an example to do that:

::: code-group

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

:::

## Testing session

To install session with Ts.ED see our [documentation page](/docs/session.md).

::: code-group

<<< @/docs/snippets/testing/session.vitest.ts [vitest]

<<< @/docs/snippets/testing/session.jest.ts [jest]

:::

## Testing with mocked service <Badge text="v7.4.0" />

One inconvenient with `PlatformTest.bootstrap()` and `PlatformTest.create()`
is that they will always call the hooks of your service like for example `$onInit()`.

::: tip Note
`PlatformTest.create()` call only the `$onInit()` hook while `PlatformTest.bootstrap()` call all hooks.
:::

This will be a problem when you want to test your application, and it uses `$onInit` to initialize your database
or something else.

Since v7.4.0, you can now mock one or more services as soon as the PlatformTest context is created (like is possible
with `PlatformTest.invoke`).

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

## Use TestContainers <Badge text="v8.9.0+" />

Ts.ED provides a way to use [TestContainers](https://www.testcontainers.org/) to run your tests in a containerized
environment.

You can use the following packages to run your tests in a containerized environment, depending on your database or
service:

- [@tsed/testcontainers-mongo](/tutorials/mongoose.md#testing) a dedicated package for Ts.ED and MongoDB (open source
  version)
- [@tsedio/testcontainers-mongo](/plugins/premium/testcontainers/mongo.md), a standalone package for MongoDB (premium
  version)
- [@tsedio/testcontainers-postgres](/plugins/premium/testcontainers/postgres.md) (premium
  version)
- [@tsedio/testcontainers-redis](/plugins/premium/testcontainers/redis.md) (premium
  version)
- [@tsedio/testcontainers-vault](/plugins/premium/testcontainers/vault.md) (premium
  version)
