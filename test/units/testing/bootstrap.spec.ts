import {bootstrap} from "@tsed/testing";
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
  let mochaContext: any;

  before(function beforeInit(done) {
    mochaContext = this;
    fn.call(mochaContext, done);
  });

  it("should return a before function", () => {
    expect(fn).to.be.a("function");
  });

  it("should attach the injector to mocha (deprecated)", () => {
    expect(mochaContext.$$injector).to.equal("Injector");
  });

  it("should replace FakeServer.startServers by a stub()", () => {
    expect(FakeServer.current.startServers).to.be.a("Function");
    expect(FakeServer.current.startServers()).to.be.an.instanceOf(Promise);
  });
});
