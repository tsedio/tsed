import {ExpressApplication, ServerSettingsService} from "@tsed/common";
import * as Express from "express";
import * as Sinon from "sinon";
import {TestContext} from "../../../../testing/src";
import {ServeStaticService} from "../../../src/server";

const sandbox = Sinon.createSandbox();

describe("ServeStaticService", () => {
  before(TestContext.create);
  before(async () => {
    sandbox.stub(Express, "static");
  });

  after(() => {
    TestContext.reset();
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
        const expressApplication = {
          use: sandbox.stub()
        };

        const serverSettingService = {
          serveStatic: {
            "/path": "/views"
          }
        };

        const serveStaticService = await TestContext.invoke(ServeStaticService, [
          {
            provide: ExpressApplication,
            use: expressApplication
          },
          {
            provide: ServerSettingsService,
            use: serverSettingService
          }
        ]);

        // @ts-ignore
        Express.static.withArgs("/views").returns(middlewareServeStatic);

        // WHEN
        serveStaticService.mount("/path", "/views");

        // THEN
        expressApplication.use.getCall(0).args[1](request, response, nextSpy);
        expressApplication.use.should.be.calledWithExactly("/path", Sinon.match.func);
        Express.static.should.be.calledWithExactly(Sinon.match("/views"));
        middlewareServeStatic.should.be.calledWithExactly(request, response, nextSpy);
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
        const expressApplication = {
          use: sandbox.stub()
        };

        const serverSettingService = {
          serveStatic: {
            "/path": "/views"
          }
        };

        const serveStaticService = await TestContext.invoke(ServeStaticService, [
          {
            provide: ExpressApplication,
            use: expressApplication
          },
          {
            provide: ServerSettingsService,
            use: serverSettingService
          }
        ]);

        // @ts-ignore
        Express.static.withArgs("/views").returns(middlewareServeStatic);

        // WHEN
        serveStaticService.mount("/path", "/views");

        // THEN
        expressApplication.use.getCall(0).args[1](request, response, nextSpy);
        expressApplication.use.should.be.calledWithExactly("/path", Sinon.match.func);
        Express.static.should.be.calledWithExactly(Sinon.match("/views"));

        nextSpy.should.be.calledWithExactly();

        return middlewareServeStatic.should.not.be.called;
      });
    });
  });
});
