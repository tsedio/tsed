import {bootstrap} from "../../../src/testing";
import {expect} from "../../tools";

class FakeServer {
  constructor() {}

  start() {
    return Promise.resolve();
  }
}

describe("bootstrap", () => {
  it("should mock server for test", done => {
    const fnMocha = bootstrap(FakeServer);

    expect(fnMocha).to.be.a("function");

    fnMocha(() => {
      expect((FakeServer as any).$$instance).to.be.instanceof(FakeServer);
      expect((FakeServer as any).$$instance.startServers).to.be.a("function");
      expect((FakeServer as any).$$instance.startServers().then).to.be.a("function");

      bootstrap(FakeServer)(done);
    });
  });

  it("should mock server for test with args", done => {
    const fnMocha = bootstrap(FakeServer, ...["test"]);

    expect(fnMocha).to.be.a("function");

    fnMocha(() => {
      expect((FakeServer as any).$$instance).to.be.instanceof(FakeServer);
      expect((FakeServer as any).$$instance.startServers).to.be.a("function");
      expect((FakeServer as any).$$instance.startServers().then).to.be.a("function");

      bootstrap(FakeServer)(done);
    });
  });
});
