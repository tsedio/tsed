import {expect} from "chai";
import {PlatformApplication, PlatformTest, ServerSettingsService} from "@tsed/common";
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
        const request = {
          test: "request"
        };
        const response = {
          headersSent: false
        };
        const nextSpy = sandbox.spy();
        const middlewareServeStatic = sandbox.stub();
        const platformApp = {
          use: sandbox.stub()
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

        // @ts-ignore
        Express.static.withArgs("/views").returns(middlewareServeStatic);

        // WHEN
        serveStaticService.mount("/path", "/views");

        // THEN
        platformApp.use.getCall(0).args[1](request, response, nextSpy);
        expect(platformApp.use).to.have.been.calledWithExactly("/path", Sinon.match.func);
        expect(Express.static).to.have.been.calledWithExactly(Sinon.match("/views"));
        expect(middlewareServeStatic).to.have.been.calledWithExactly(request, response, nextSpy);
      });
    });
    describe("when headers is sent", () => {
      after(() => {
        sandbox.reset();
      });
      it("should call the express use method", async () => {
        // GIVEN
        const request = {
          test: "request"
        };
        const response = {
          headersSent: true
        };
        const nextSpy = sandbox.spy();
        const middlewareServeStatic = sandbox.stub();
        const platformApp = {
          use: sandbox.stub()
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

        // @ts-ignore
        Express.static.withArgs("/views").returns(middlewareServeStatic);

        // WHEN
        serveStaticService.mount("/path", "/views");

        // THEN
        platformApp.use.getCall(0).args[1](request, response, nextSpy);
        expect(platformApp.use).to.have.been.calledWithExactly("/path", Sinon.match.func);
        expect(Express.static).to.have.been.calledWithExactly(Sinon.match("/views"));

        expect(nextSpy).to.have.been.calledWithExactly();

        return expect(middlewareServeStatic).to.not.be.called;
      });
    });
  });
});
