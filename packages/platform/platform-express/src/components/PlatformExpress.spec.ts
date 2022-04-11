import {PlatformBuilder} from "@tsed/common";
import Sinon from "sinon";
import {expect} from "chai";
import {PlatformExpress} from "@tsed/platform-express";

const sandbox = Sinon.createSandbox();

class Server {}

describe("PlatformExpress", () => {
  describe("create()", () => {
    beforeEach(() => {
      sandbox.stub(PlatformBuilder, "create");
    });
    afterEach(() => sandbox.restore());
    it("should create platform", () => {
      PlatformExpress.create(Server, {});

      expect(PlatformBuilder.create).to.have.been.calledWithExactly(Server, {
        adapter: PlatformExpress
      });
    });
  });
  describe("bootstrap()", () => {
    beforeEach(() => {
      sandbox.stub(PlatformBuilder, "bootstrap");
    });
    afterEach(() => sandbox.restore());
    it("should create platform", async () => {
      await PlatformExpress.bootstrap(Server, {});

      expect(PlatformBuilder.bootstrap).to.have.been.calledWithExactly(Server, {
        adapter: PlatformExpress
      });
    });
  });

  describe("bodyParser()", () => {
    afterEach(() => sandbox.restore());
    it("should return the body parser (json) ", () => {
      const stub = sandbox.stub().returns("body");

      const platform = PlatformExpress.create(Server, {
        express: {
          bodyParser: {
            json: stub
          }
        }
      });

      const result = platform.adapter.bodyParser("json", {strict: true});

      expect(result).to.equal("body");
      expect(stub).to.have.been.calledWithExactly({strict: true});
    });
    it("should return the body parser (raw) ", () => {
      const stub = sandbox.stub().returns("body");

      const platform = PlatformExpress.create(Server, {
        express: {
          bodyParser: {
            raw: stub
          }
        }
      });

      const result = platform.adapter.bodyParser("raw", {strict: true});

      expect(result).to.equal("body");
      expect(stub).to.have.been.calledWithExactly({strict: true, type: Sinon.match.func});
    });
    it("should return the body parser (urlencoded) ", () => {
      const stub = sandbox.stub().returns("body");

      const platform = PlatformExpress.create(Server, {
        express: {
          bodyParser: {
            urlencoded: stub
          }
        }
      });

      const result = platform.adapter.bodyParser("urlencoded", {strict: true});

      expect(result).to.equal("body");
      expect(stub).to.have.been.calledWithExactly({extended: true, strict: true});
    });
  });
});
