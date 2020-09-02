import {PlatformApplication, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Express from "express";
import * as Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import "./PlatformExpressApplication";

const sandbox = Sinon.createSandbox();

describe("PlatformExpressApplication", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("statics()", () => {
    beforeEach(async () => {
      sandbox.stub(Express, "static");
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should create a PlatformApplication", async () => {
      const middlewareServeStatic = sandbox.stub();

      stub(Express.static).returns(middlewareServeStatic);

      const app = await PlatformTest.invoke<PlatformApplication>(PlatformApplication);

      sandbox.stub(app, "use");

      app.statics("/path", {
        root: "/publics",
        options: "options"
      });

      expect(Express.static).to.have.been.calledWithExactly(Sinon.match("/publics"), {options: "options"});
      expect(app.use).to.have.been.calledWithExactly("/path", Sinon.match.func);
    });
  });
});
