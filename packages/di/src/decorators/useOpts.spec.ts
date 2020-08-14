import {PlatformTest, ProviderScope, Scope} from "@tsed/common";
import {descriptorOf} from "@tsed/core";
import {Inject, Injectable, Opts, UseOpts} from "@tsed/di";
import {expect} from "chai";

describe("UseOpts", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should inject provider with options", async () => {
    @Injectable()
    class MyProvider {
      source: any;

      constructor(@Opts options: any = {}) {
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

    const service = await PlatformTest.invoke<MyService>(MyService);

    expect(service.service2.source).to.equal("test2");
    expect(service.service2).to.not.equal(service.service1);

    expect(service.service1).to.instanceof(MyProvider);
    expect(service.service1.source).to.equal("test1");

    expect(service.service2).to.instanceof(MyProvider);
  });
  it("should invoke a service which use a configurable provider", async () => {
    @Injectable()
    class MyProvider {
      source: any;

      constructor(@Opts options: Partial<any> = {}) {
        this.source = options.source;
      }
    }

    @Injectable()
    class MyService {
      constructor(@UseOpts({source: "test2"}) public service2: MyProvider) {}
    }

    @Injectable()
    @Scope(ProviderScope.SINGLETON)
    class MyRepoService extends MyProvider {}

    await PlatformTest.invoke<MyRepoService>(MyRepoService);
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
    expect(actualError.message).to.deep.eq("UseOpts cannot be used as method.static decorator on Test.test");
  });
});
