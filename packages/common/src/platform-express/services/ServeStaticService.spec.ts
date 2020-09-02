import {PlatformApplication, PlatformTest, ServerSettingsService} from "@tsed/common";
import {expect} from "chai";
import * as Express from "express";
import * as Sinon from "sinon";
import {ServeStaticService} from "./ServeStaticService";

const sandbox = Sinon.createSandbox();

describe("ServeStaticService", () => {
  before(PlatformTest.create);
  before(async () => {
    sandbox.stub(Express, "static");
  });

  after(() => {
    PlatformTest.reset();
    sandbox.restore();
  });

  describe("mount()", () => {
    describe("when headers is not sent", () => {
      after(() => {
        sandbox.reset();
      });
      it("should call the express use method", async () => {
        // GIVEN
        const platformApp = {
          statics: sandbox.stub()
        };

        const serverSettingService = {
          statics: {
            "/path": "/views"
          }
        };

        const serveStaticService = await PlatformTest.invoke(ServeStaticService, [
          {
            token: PlatformApplication,
            use: platformApp
          },
          {
            token: ServerSettingsService,
            use: serverSettingService
          }
        ]);

        // WHEN
        serveStaticService.statics({"/path": ["/views"]});

        // THEN
        expect(platformApp.statics).to.have.been.calledWithExactly("/path", {root: "/views"});
      });
    });
  });
});
