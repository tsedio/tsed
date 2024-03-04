# Testing

## Unit test

### Installation

Ts.ED support officially two unit test frameworks: Jest, Mocha and Vitest. It's also possible to use your
preferred frameworks. Your feedback are welcome.

<Tabs>
  <Tab label="Jest">

See the dedicated guide installation for Jest [here](/tutorials/jest.md).

  </Tab>

  <Tab label="Vitest">

See the dedicated guide installation for Vitest [here](/tutorials/vitest.md).

  </Tab>
  <Tab label="Mocha + chai (deprecated)">

Run these commands to install mocha chai and sinon:

```bash
$ yarn add -D nyc mocha chai chai-as-promised @types/mocha @types/chai @types/chai-as-promised
$ yarn add -D sinon sinon-chai @types/sinon @types/sinon-chai
// OR
$ npm install --save-dev nyc mocha chai chai-as-promised @types/mocha @types/chai @types/chai-as-promised
$ npm install --save-dev sinon sinon-chai @types/sinon @types/sinon-chai
```

Add in your package.json the following task:

```json
{
  "test:unit": "cross-env NODE_ENV=test mocha",
  "test:coverage": "cross-env NODE_ENV=test nyc mocha"
}
```

Then create a new `.mocharc.js` on your root project and the following content:

```javascript
module.exports = {
  require: ["ts-node/register/transpile-only", "tsconfig-paths/register", "scripts/mocha/register"],
  recursive: true,
  reporter: "dot",
  spec: ["src/**/*.spec.ts", "test/**/*.spec.ts"]
};
```

Then create a new `.nycrc` on your root project and the following content:

```json
{
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.d.ts", "node_modules", "**/index.ts", "**/interfaces/**", "**/*.spec.ts"],
  "reporter": ["text-summary", "html", "lcov"],
  "extension": [".ts"],
  "check-coverage": true,
  "all": true
}
```

And finally, create a mocha setup file `scripts/mocha/register.js`, to configure mocha with chai and sinon:

```javascript
const Chai = require("chai");
const ChaiAsPromised = require("chai-as-promised");
const SinonChai = require("sinon-chai");

Chai.should();
Chai.use(SinonChai);
Chai.use(ChaiAsPromised);

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});
```

  </Tab>
</Tabs>

### Usage

Ts.ED provides @@PlatformTest@@ to create a new context to inject your Services, Controllers, Middlewares, etc...
registered with annotations like @@Injectable@@.

The process to test any components is the same thing:

- Create a new context for your unit test with `PlatformTest.create`,
- Inject or invoke your component with `PlatformTest.inject` or `PlatformTest.invoke`,
- Reset the context with `PlatformTest.reset`.

Here is an example to test the ParseService:

<Tabs class="-code">
  <Tab label="Jest">

<<< @/docs/snippets/testing/parse-service.jest.spec.ts

  </Tab>
  <Tab label="Vitest">

<<< @/docs/snippets/testing/parse-service.vitest.spec.ts

  </Tab>
  <Tab label="Mocha">

<<< @/docs/snippets/testing/parse-service.mocha.spec.ts

  </Tab>
  <Tab label="ParseService.ts">

<<< @/docs/snippets/testing/parse-service.ts

  </Tab>  
</Tabs>

### Async / Await

Testing asynchronous method is also possible using `Promises` (`async`/`await`):

<Tabs class="-code">
  <Tab label="Jest">

<<< @/docs/snippets/testing/db-service-async-await.jest.ts

  </Tab>
  <Tab label="Vitest">

<<< @/docs/snippets/testing/db-service-async-await.vitest.ts

  </Tab>
  <Tab label="Mocha">

<<< @/docs/snippets/testing/db-service-async-await.mocha.ts

  </Tab>
</Tabs>

### Mock dependencies

PlatformTest API provides an `invoke` method to create a new instance of your component with mocked dependencies.

<Tabs class="-code">
  <Tab label="Jest">

<<< @/docs/snippets/testing/db-service-mock-dependencies.jest.ts

  </Tab>
  <Tab label="Vitest">

<<< @/docs/snippets/testing/db-service-mock-dependencies.vitest.ts

  </Tab>
  <Tab label="Mocha">

<<< @/docs/snippets/testing/db-service-mock-dependencies.mocha.ts

  </Tab> 
</Tabs>

::: tip
`PlatformTest.invoke()` executes automatically the `$onInit` hook!
:::

## Test your Rest API

### Installation

To test your API, I recommend you to use the [`supertest`](https://github.com/visionmedia/supertest) module.

To install supertest just run these commands:

<Tabs class="-code">
  <Tab label="Yarn">

```bash
$ yarn add -D supertest @types/supertest
```

  </Tab>
  <Tab label="Npm">

```bash
$ npm install --save-dev supertest @types/supertest
```

  </Tab>
</Tabs>

### Example

<Tabs class="-code">
  <Tab label="Jest">

```ts
import {PlatformTest} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../Server";

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

  </Tab>
  <Tab label="Vitest">

```ts
import {it, expect, describe, beforeAll, afterAll} from "vitest";
import {PlatformTest} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../Server";

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

  </Tab>
  <Tab label="Mocha">

```ts
import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../Server";
import TestAgent = require("supertest/lib/agent");

describe("Rest", () => {
  before(PlatformTest.bootstrap(Server));
  after(PlatformTest.reset);

  describe("GET /rest/calendars", () => {
    it("should do something", async () => {
      const request = SuperTest.agent(PlatformTest.callback());

      const response = await request.get("/rest/calendars").expect(200);

      expect(response.body).to.be.an("array");
    });
  });
});
```

  </Tab> 
</Tabs>

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

<Tabs class="-code">
  <Tab label="Jest">

```typescript
import {PlatformTest} from "@tsed/common";
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

  </Tab>
  <Tab label="Vitest">

```typescript
import {it, expect, describe, beforeAll, afterAll} from "vitest";
import {PlatformTest} from "@tsed/common";
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

  </Tab>
  <Tab label="Mocha">

```typescript
import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import Sinon from "sinon";
import {Server} from "../../Server";
import {Chapter} from "../../entity/Chapter";

const entity = new Chapter();
Object.assign(entity, {
  id: 2,
  bookId: 4,
  timestamp: 1650996201,
  name: "First Day At Work"
});

const sandbox = Sinon.createSandbox();
describe("ChapterController", () => {
  beforeAll(PlatformTest.bootstrap(Server));
  afterAll(PlatformTest.reset);
  afterAll(() => sandbox.restore());

  describe("GET /rest/chapter", () => {
    it("Get All Chapters", async () => {
      const service = PlatformTest.get(ChapterService);

      sandbox.stub(service, "findChapters").resolves([entity]);
      request = SuperTest(PlatformTest.callback());

      const response = await request.get("/rest/chapter").expect(200);
      expect(typeof response.body).to.eq("object");
    });
  });
});
```

  </Tab>
</Tabs>

### Stub a middleware method <Badge text="6.114.3+" />

When you're testing your API, you have sometimes to stub middleware to disable authentication for example.

Here is an example to do that:

<Tabs class="-code">
  <Tab label="Jest">

```typescript
import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {HelloWorldController} from "./HelloWorldController";
import {Server} from "../../Server";
import {AuthMiddleware} from "../../middlewares/auth.middleware";

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

</Tab>
  <Tab label="Vitest">

```typescript
import {it, expect, describe, beforeAll, afterAll, beforeEach} from "vitest";
import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {HelloWorldController} from "./HelloWorldController";
import {Server} from "../../Server";
import {AuthMiddleware} from "../../middlewares/auth.middleware";

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

</Tab>
<Tab label="Mocha">

```typescript
import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import Sinon from "sinon";
import {HelloWorldController} from "./HelloWorldController";
import {Server} from "../../Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {AuthMiddleware} from "../../middlewares/auth.middleware";

const sandbox = Sinon.createSandbox();

describe("HelloWorldController", () => {
  beforeAll(TestMongooseContext.bootstrap(Server));
  beforeAll(() => {
    const authMiddleware = PlatformTest.get<AuthMiddleware>(AuthMiddleware);
    sandbox.stub(authMiddleware, "use").resolves(true);
  });
  beforeEach(() => {
    sandbox.restore();
  });
  afterAll(TestMongooseContext.reset);

  it("should return value", async () => {
    const request = SuperTest(PlatformTest.callback());
    const response = await request.get("/rest/hello-world").expect(200);
    expect(response.text).to.equal("hello");
  });
});
```

</Tab>
</Tabs>

## Testing session

To install session with Ts.ED see our [tutorial](/tutorials/session.md).

<Tabs class="-code">
<Tab label="Jest">

<<< @/tutorials/snippets/session/example-test.jest.ts

</Tab>
<Tab label="Vitest">

<<< @/tutorials/snippets/session/example-test.vitest.ts

</Tab>
<Tab label="Mocha">

<<< @/tutorials/snippets/session/example-test.mocha.ts

</Tab>
</Tabs>

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
import {PlatformTest} from "@tsed/common";
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
