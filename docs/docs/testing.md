# Testing

## Unit test
### Installation

All following examples are based on `mocha + chai` testing framework. Obviously, you can use another framework like Jasmine !
To install mocha and chai just run these commands:

```
npm install --save-dev mocha chai @types/mocha @types/chai
```

### Testing

Ts.ED are bundled with a testing module `@tsed/testing`. This module provide a function `inject()` to inject your Services, Controllers, Middlewares, etc... collected via annotation `@Service()`.

Example of unit test for the `ParseService`:

```typescript
import {expect} from "chai";
import {inject} from "@tsed/testing";
import {ParseService} from "@tsed/common";

describe("ParseService", () => {
    describe("clone()", () => {
        it("should clone object", () => {
            const source = {};
            expect(ParseService.clone(source)).not.to.be.equal(source);
        });
    });

    describe("eval()", () => {
        let parseService;
        before(inject([ParseService], (_parseService_: ParseService) => {
            parseService = _parseService_;
        });
        it("should evaluate expression with a scope and return value", () => {
            expect(parseService.eval("test", {
                test: "yes"
            })).to.equal("yes");
        }));
    });
});
```

Testing asynchronous method is also possible with `Done` function:

```typescript
import {expect} from "chai";
import {inject, Done} from "@tsed/testing";
import {DbService} from "../services/db";

describe("DbService", () => {
    let result: any;
    before(inject([DbService, Done], (dbService: DbService, done: Done) => {
        dbService
        .getData()
        .then((data) => {
            result = data;
            done();
        });
    }));
    it("should data from db", () => {
        expect(result).to.be.an("object");
    });
});
```
> You can use also the `chai-promised` librairy for asynchronous test base on promise.

### Testing controllers
#### basic usage

Use `InjectorService` to get your controller from injector and test it:

```typescript
import {expect} from "chai";
import {inject, bootstrap} from "@tsed/testing";
import {MyCtrl} from "../controllers/MyCtrl";
import {Server} from "../Server";

describe("MyCtrl", () => {
    let instance;
    // bootstrap your Server to load all endpoints before run your test
    before(bootstrap(Server));
    
    before(inject([CalendarCtrl], (calendarCtrl: CalendarCtrl) => {
       instance = calendarCtrl
    }))

    it("should do something", () => {
        expect(!!myCtrl).to.be.true;
    });
});
```

Or invoke a new instance of your controller like this:

```typescript
import {expect} from "chai";
import {InjectorService} from "@tsed/common";
import {inject, bootstrap} from "@tsed/testing";
import {MyCtrl} from "../controllers/MyCtrl";

describe("MyCtrl", () => {
    let instance: any;
    // bootstrap your Server to load all endpoints before run your test
    before(bootstrap(Server));
    
    before(inject([InjectorService], (injectorService: InjectorService) => {
       instance = InjectorService.invoke(MyCtrl);
    }))

    it("should do something", () => {
        expect(!!instance).to.be.true;
    });
});
```

#### Mock dependencies

```typescript
// in MyCtrl.ts
import {Get, Controller} from "@tsed/testing";
import {DbService} from "../services/DbService";

@Controller("/")
export class MyCtrl {
   constructor(private dbService: DbService) {
       
   }

   @Get("/")
   public getData() {
      return this.dbService.getData();
   }
}
```

```typescript
// in MyCtrl.spec.ts
import {expect} from "chai";
import {inject} from "@tsed/testing";
import {MyCtrl} from "../controllers/MyCtrl";
import {DbService} from "../services/DbService";

describe("MyCtrl", () => {

    // bootstrap your Server to load all endpoints before run your test
    before(bootstrap(Server));

    it("should do something", inject([InjectorService], (injector: InjectorService) => {
        
        // create locals map
        const locals = new Map<any, any>();
        
        // replace DbService by a faker
        locals.set(DbService, {
            getData: () => {
               return "test";
            }
        })

        // give the locals map to the invoke method
        const instance: MyCtrl = injector.invoke<MyCtrl>(MyCtrl, locals);

        // and test it
        expect(!!instance).to.be.true;
        expect(instance.getData()).to.equals("test");
    }));
});
```

### Testing converters

`Converters` lets you customize how [ConverterService](converters.md) will deserialize a data for one or more types. This example show you the unit test for the Array type. 

The converter implementation in Ts.ED for Array type is the following:

```typescript
@Converter(Array)
export class ArrayConverter implements IConverter {

    constructor(private converterService: ConverterService) {}

    deserialize<T>(data: any, target: any, baseType?: T): T[] {

        if (isArrayOrArrayClass(data)) {
            return (data as Array<any>).map(item =>
                this.converterService.deserialize(item, baseType)
            );
        }

        return [data];
    }

    serialize(data: any[]) {
        return (data as Array<any>).map(item =>
            this.converterService.serialize(item)
        );
    }
}
```

And the unit test:

```typescript
import {ConverterService} from "@tsed/common";
import {inject} from "@tsed/testing";
import * as Chai from "chai";
import * as Sinon from "Sinon";

const expect = Chai.expect;

Chai.should();
Chai.use(SinonChai);

describe("ArrayConverter", () => {
  before(
    inject([ConverterService], (converterService: ConverterService) => {
      this.arrayConverter = converterService.getConverter(Array);
    })
  );

  it("should do something", () => {
    expect(!!this.arrayConverter).to.be.true;
  });

  describe("deserialize()", () => {
    before(() => {
      this.deserializer = Sinon.stub();
    });
    it("should deserialize data as array when a number is given", () => {
      expect(this.arrayConverter.deserialize(1, Array, Number, this.deserializer)).to.be.an("array");
    });

    it("should deserialize data as array when an array is given", () => {
      expect(this.arrayConverter.deserialize([1], Array, Number, this.deserializer)).to.be.an("array");
    });

    it("should call the deserializer callback", () => {
      this.deserializer.should.have.been.calledWithExactly(1, Number);
    });
  });
});
```

### Testing middlewares

`@Middleware()` is similar to the Express middleware with the difference that it is a class and you can use the IoC to inject other services on his constructor.

```typescript
import {inject} from "@tsed/testing";
import {AcceptMimesMiddleware} from "@tsed/common";
import * as Sinon from "sinon";

describe("AcceptMimesMiddleware", () => {
  it("should accept mime", inject([AcceptMimesMiddleware], (middleware: AcceptMimesMiddleware) => {

    const request: any = {
      accepts: Sinon.stub().returns(true)
    };
    request.mime = "application/json";

    middleware.use({
      get: () => {
        return ["application/json"];
      }
    } as any, request as any);

  }));
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
import {bootstrap, inject} from "@tsed/testing";
import * as SuperTest from "supertest";
import {expect} from "chai";
import {Server} from "../Server";

describe("Rest", () => {
    // bootstrap your Server to load all endpoints before run your test
    beforeEach(bootstrap(Server));

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
It is useful to suppress logging during unit tests runs so that your passed/failed test summary does not get polluted with information.

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

<gist repo="Romakita" id="a95fe9d491f453d038b5bec0cbe72e8f" filename="tools.ts"></gist>

<div class="guide-links">
<a href="#/docs/server-loader/lifecycle-hooks">ServerLoader</a>
<a href="#/tutorials/overview">Tutorials</a>
</div>
