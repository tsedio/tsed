import {Configuration, Controller, Get, InjectorService, PlatformTest, RequestContext} from "@tsed/common";
import {expect} from "chai";

@Configuration({})
class Server {}

@Controller("/")
class MyController {
  @Get("/")
  get() {
    return "hello";
  }
}

describe("PlatformTest", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should get symbol from injector", () => {
    expect(PlatformTest.get(InjectorService)).to.be.instanceOf(InjectorService);
  });

  describe("createRequestContext", () => {
    it("should return request context", () => {
      expect(PlatformTest.createRequestContext()).to.be.instanceOf(RequestContext);
    });
  });

  describe("invoke", () => {
    it("should return request context", async () => {
      class Test {
        called: boolean;

        async $onInit() {
          this.called = true;
        }
      }

      expect(await PlatformTest.invoke(Test)).to.deep.eq({called: true});
    });
  });
});
