# Testing

## Unit test
### Installation

All following examples are based on `mocha + chai` testing framework. Obviously, you can use another framework like Jasmine !
To install mocha and chai just run these commands:

```
npm install --save-dev mocha chai @types/mocha @types/chai
```

### Usage

Ts.ED are bundled with a testing module `@tsed/testing`.
This module provide `TextContext` to create new context and `inject` function to inject your Services, Controllers, Middlewares, etc... registered with annotation like `@Service()`.

The process to test any components is the same things:

- Create a new context for your unit test with `TestContext.create`,
- Inject or invoke your component with `TestContext.inject` or `TestContext.invoke`,
- Reset the context with `TestContext.reset`.

Here an example to test the ParseService:
```typescript
import {expect} from "chai";
import {TestContext, inject} from "@tsed/testing";
import {ParseService} from "@tsed/common";

describe("ParseService", () => {
  before(TestContext.create);
  after(TestContext.reset);
  describe("eval()", () => {
    it("should evaluate expression with a scope and return value", inject([ParseService], (parseService: ParseService) => {
      expect(parseService.eval("test", {
        test: "yes"
        })).to.equal("yes");
    }));
  });
});
```

### Async / Await

Testing asynchronous method is also possible using `Promise`s (`async`/`await`):

```typescript
import {expect} from "chai";
import {inject, TestContext} from "@tsed/testing";
import {DbService} from "../services/db";

describe("DbService", () => {
    let result: any;
    before(TestContext.create)
    after(TestContext.reset)
    
    it("should data from db", inject([DbService], async (dbService: DbService) => {
        result = await dbService.getData();
        expect(result).to.be.an("object");
    }));
});
```

### Mock dependencies

TestContext API provide an `invoke` method to create a new instance of your component with mocked dependencies.

```typescript
// in MyCtrl.spec.ts
import {expect} from "chai";
import {inject, TestContext} from "@tsed/testing";
import {MyCtrl} from "../controllers/MyCtrl";
import {DbService} from "../services/DbService";

describe("MyCtrl", () => {

    // bootstrap your Server to load all endpoints before run your test
    before(TestContext.create)
    after(TestContext.reset);

    it("should do something", async () => {
        // create locals map
        const locals = new Map<any, any>();
        
        // replace DbService by a faker
        locals.set(DbService, {
            getData: () => {
               return "test";
            }
        })

        // give the locals map to the invoke method
        const instance: MyCtrl = await TestContext.invoke<MyCtrl>(MyCtrl, locals);

        // and test it
        expect(!!instance).to.be.true;
        expect(instance.getData()).to.equals("test");
    });
});
```


## Test your Rest API
### Installation

To test your API, I recommend you to use the [`supertest`](https://github.com/visionmedia/supertest) module.

To install supertest just run these commands:

```bash
npm install --save-dev supertest @types/supertest
```

### Example

```typescript
import {ExpressApplication} from "@tsed/common";
import {bootstrap, inject, TestContext} from "@tsed/testing";
import * as SuperTest from "supertest";
import {expect} from "chai";
import {Server} from "../Server";

describe("Rest", () => {
    // bootstrap your Server to load all endpoints before run your test
    beforeEach(bootstrap(Server));
    afterEach(TestContext.reset);

    describe("GET /rest/calendars", () => {
        let app;

        before(bootstrap(Server));
        before(inject([ExpressApplication], (expressApplication: ExpressApplication) => {
            app = SuperTest(expressApplication)
        }));

        it("should do something", (done) => {
            app
                .get("/rest/calendars")
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        throw (err);
                    }

                    const obj = JSON.parse(response.text);

                    expect(obj).to.be.an("array");

                    done();
                });
        });
    });
});
```

### Disable Logs

If you like to disable log output for any reason, you can do it by calling `$log.level` or `$log.stop()`.
It's useful to suppress logging during unit tests runs so that your passed/failed test summary does not get polluted with information.

```typescript
import { $log } from "ts-log-debug";

describe('A test that will not print logs :', () => {

    before(() => {
        $log.level = "OFF"
    });

    /* you tests here */
});
```

## Utils (recommended)

In addiction, you can use some library like Sinon and Chai-promised for your unit test. To help you, here the `tools.ts` code used by the unit test for Ts.ED:

<Gist repo="Romakita" id="a95fe9d491f453d038b5bec0cbe72e8f" filename="tools.ts"></Gist>
