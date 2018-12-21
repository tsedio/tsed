import {TestContext} from "@tsed/testing";
import {InjectorService, Provider} from "@tsed/di";
import {expect} from "../../tools";

class FakeServer {
  static current: FakeServer;

  startServers: Function;

  injector = new InjectorService();

  async start() {
    FakeServer.current = this;

    return this.startServers();
  }
}

describe("TestContext", () => {
  describe("reset()", () => {
    before(TestContext.create);

    it("should reset the injector", () => {
      const injectionKey = "key";
      TestContext.injector.set(injectionKey, new Provider("something"));
      TestContext.reset();
      expect((TestContext as any)._injector).eq(null);
    });
  });
  describe("bootstrap()", () => {
    beforeEach(TestContext.bootstrap(FakeServer as any));
    afterEach(TestContext.reset);

    it("should attach injector instance to TestContext", () => {
      expect(TestContext.injector).to.be.instanceof(InjectorService);
    });

    it("should replace FakeServer.startServers by a stub()", () => {
      expect(FakeServer.current.startServers).to.be.a("Function");
      expect(FakeServer.current.startServers()).to.be.an.instanceOf(Promise);
    });
  });
});
