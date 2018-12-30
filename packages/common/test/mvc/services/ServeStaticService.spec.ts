import {ExpressApplication, ServerSettingsService} from "@tsed/common";
import {invoke} from "@tsed/testing";
import * as Express from "express";
import * as Sinon from "sinon";
import {TestContext} from "../../../../testing/src";
import {ServeStaticService} from "../../../src/server";

describe("ServeStaticService", () => {
  let serveStatic: any;
  const middlewareServeStatic = Sinon.stub();
  const expressApplication = {
    use: Sinon.stub()
  };

  const serverSettingService = {
    serveStatic: {
      "/path": "/views"
    }
  };

  before(TestContext.create);
  before(() => {
    serveStatic = Sinon.stub(Express, "static");
    serveStatic.withArgs("/views").returns(middlewareServeStatic);

    this.serveStaticService = TestContext.invoke(ServeStaticService, [
      {
        provide: ExpressApplication,
        use: expressApplication
      },
      {
        provide: ServerSettingsService,
        use: serverSettingService
      }
    ]);
  });

  after(() => {
    TestContext.reset();
    serveStatic.restore();
  });

  describe("mount()", () => {
    describe("when headers is not sent", () => {
      before(() => {
        this.serveStaticService.mount("/path", "/views");
        this.request = {
          test: "request"
        };
        this.response = {
          headersSent: false
        };
        this.nextSpy = Sinon.spy();

        expressApplication.use.getCall(0).args[1](this.request, this.response, this.nextSpy);
      });
      after(() => {
        expressApplication.use.reset();
        serveStatic.reset();
        middlewareServeStatic.reset();
      });
      it("should call the express use method", () => {
        expressApplication.use.should.be.calledWithExactly("/path", Sinon.match.func);
      });
      it("should call serveStatic", () => {
        serveStatic.should.be.calledWithExactly(Sinon.match("/views"));
      });

      it("should call the middleware", () => {
        middlewareServeStatic.should.be.calledWithExactly(this.request, this.response, this.nextSpy);
      });
    });

    describe("when headers is sent", () => {
      before(() => {
        this.serveStaticService.mount("/path", "/views");
        this.request = {
          test: "request"
        };
        this.response = {
          headersSent: true
        };
        this.nextSpy = Sinon.spy();

        expressApplication.use.getCall(0).args[1](this.request, this.response, this.nextSpy);
      });
      after(() => {
        expressApplication.use.reset();
        serveStatic.reset();
        middlewareServeStatic.reset();
      });
      it("should call the express use method", () => {
        expressApplication.use.should.be.calledWithExactly("/path", Sinon.match.func);
      });
      it("should call serveStatic", () => {
        serveStatic.should.be.calledWithExactly("/views");
      });

      it("should not call the middleware", () => {
        middlewareServeStatic.should.not.be.called;
      });

      it("should call the next function", () => {
        this.nextSpy.should.be.calledWithExactly();
      });
    });
  });
});
