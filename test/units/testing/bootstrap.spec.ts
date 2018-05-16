import {bootstrap, servers} from "../../../src/testing";
import {expect} from "../../tools";

class FakeServer {
  constructor() {}

  start() {
    return Promise.resolve();
  }
}

describe("bootstrap", () => {
  describe("without args", () => {
    let instance: any;
    before(bootstrap(FakeServer));
    before(() => {
      instance = servers.get(FakeServer).instance;
    });
    it("should mock server for test (1)", () => {
      expect(instance).to.be.instanceof(FakeServer);
    });

    it("should mock server for test (2)", () => {
      expect(instance.startServers).to.be.a("function");
    });

    it("should mock server for test (3)", () => {
      expect(instance.startServers().then).to.be.a("function");
    });
  });

  describe("with args", () => {
    let instance: any;
    before(bootstrap(FakeServer, ...["test"]));
    before(() => {
      instance = servers.get(FakeServer).instance;
    });
    it("should mock server for test (1)", () => {
      expect(instance).to.be.instanceof(FakeServer);
    });

    it("should mock server for test (2)", () => {
      expect(instance.startServers).to.be.a("function");
    });

    it("should mock server for test (3)", () => {
      expect(instance.startServers().then).to.be.a("function");
    });
  });
});
