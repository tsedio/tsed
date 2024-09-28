import {descriptorOf} from "@tsed/core";

import {DITest} from "../../node/index.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {Inject} from "./inject.js";
import {Injectable} from "./injectable.js";
import {Opts} from "./opts.js";
import {Scope} from "./scope.js";
import {UseOpts} from "./useOpts.js";

describe("UseOpts", () => {
  let testContext: any;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());
  it("should inject provider with options", async () => {
    @Injectable()
    class MyProvider {
      source: any;

      constructor(@Opts options: any = {}) {
        testContext.source = options.source;
        this.source = options.source;
      }
    }

    @Injectable()
    class MyService {
      @Inject()
      @UseOpts({
        source: "test1"
      })
      service1: MyProvider;

      constructor(@UseOpts({source: "test2"}) public service2: MyProvider) {}
    }

    const service = await DITest.invoke<MyService>(MyService);

    expect(service.service2.source).toEqual("test2");
    expect(service.service2).not.toEqual(service.service1);

    expect(service.service1).toBeInstanceOf(MyProvider);
    expect(service.service1.source).toEqual("test1");

    expect(service.service2).toBeInstanceOf(MyProvider);
  });
  it("should invoke a service which use a configurable provider", async () => {
    @Injectable()
    class MyProvider {
      source: any;

      constructor(@Opts options: Partial<any> = {}) {
        testContext.source = options.source;
      }
    }

    @Injectable()
    class MyService {
      constructor(@UseOpts({source: "test2"}) public service2: MyProvider) {}
    }

    @Injectable()
    @Scope(ProviderScope.SINGLETON)
    class MyRepoService extends MyProvider {}

    await DITest.invoke<MyRepoService>(MyRepoService);
  });
  it("should store metadata", () => {
    // GIVEN
    class Test {
      test() {}
    }

    // WHEN
    let actualError;
    try {
      UseOpts({})(Test, "test", descriptorOf(Test, "test"));
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).toEqual("UseOpts cannot be used as method.static decorator on Test.test");
  });
});
