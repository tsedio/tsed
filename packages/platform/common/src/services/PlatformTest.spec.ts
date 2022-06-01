import {Configuration, Controller, Get, InjectorService, PlatformTest, PlatformContext} from "@tsed/common";

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
  let testContext: any;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should get symbol from injector", () => {
    expect(PlatformTest.get(InjectorService)).toBeInstanceOf(InjectorService);
  });

  describe("createRequestContext", () => {
    it("should return request context", () => {
      expect(PlatformTest.createRequestContext()).toBeInstanceOf(PlatformContext);
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

      expect(await PlatformTest.invoke(Test)).toEqual({called: true});
    });
  });
});
