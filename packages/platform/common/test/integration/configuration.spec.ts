import {Controller, createInjector, Get} from "@tsed/common";
import {Module} from "@tsed/di";
import {expect} from "chai";
import {FakeAdapter} from "../../src/services/FakeAdapter";

describe("DI", () => {
  it("should merge DI configuration", async () => {
    @Controller("/global")
    class ControllerGlobal {
      @Get("/")
      get() {}
    }

    @Controller("/module")
    class ControllerModule {
      @Get("/")
      get() {}
    }

    @Module({
      mount: {
        "/rest": [ControllerModule]
      }
    })
    class MyModule {}

    const injector = createInjector({
      adapter: new FakeAdapter(),
      settings: {
        mount: {
          "/rest": [ControllerGlobal]
        },
        imports: [MyModule]
      }
    });
    injector.add(MyModule);

    injector.resolveConfiguration();

    expect(injector.settings.mount).to.deep.eq({
      "/rest": [ControllerModule, ControllerGlobal]
    });
  });
});
