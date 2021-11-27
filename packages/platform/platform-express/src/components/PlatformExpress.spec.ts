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
});
