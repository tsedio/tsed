import {PlatformBuilder} from "@tsed/common";
import Sinon from "sinon";
import {expect} from "chai";
import {PlatformKoa} from "./PlatformKoa";

const sandbox = Sinon.createSandbox();

class Server {}

describe("PlatformKoa", () => {
  describe("create()", () => {
    beforeEach(() => {
      sandbox.stub(PlatformBuilder, "create");
    });
    afterEach(() => sandbox.restore());
    it("should create platform", () => {
      PlatformKoa.create(Server, {});

      expect(PlatformBuilder.create).to.have.been.calledWithExactly(Server, {
        adapter: PlatformKoa
      });
    });
  });
  describe("bootstrap()", () => {
    beforeEach(() => {
      sandbox.stub(PlatformBuilder, "bootstrap");
    });
    afterEach(() => sandbox.restore());
    it("should create platform", async () => {
      await PlatformKoa.bootstrap(Server, {});

      expect(PlatformBuilder.bootstrap).to.have.been.calledWithExactly(Server, {
        adapter: PlatformKoa
      });
    });
  });
});
