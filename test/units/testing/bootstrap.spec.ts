import {bootstrap, TestContext} from "@tsed/testing";
import {expect} from "../../tools";

class FakeServer {
  static current: FakeServer;
  startServers: Function;

  injector = "Injector";

  async start() {
    FakeServer.current = this;

    return this.startServers();
  }
}

describe("bootstrap()", () => {
  const fn = bootstrap(FakeServer);

  beforeEach(fn);
  afterEach(TestContext.reset);

  it("should return before function", () => {
    expect(fn).to.be.a("function");
  });

  it("should return promise after executing the function", () => {
    expect(fn()).instanceOf(Promise);
  });

  it("should attach injector instance to TestContext", () => {
    expect(TestContext.injector).to.eq("Injector");
  });

  it("should replace FakeServer.startServers by a stub()", () => {
    expect(FakeServer.current.startServers).to.be.a("Function");
    expect(FakeServer.current.startServers()).to.be.an.instanceOf(Promise);
  });
});
