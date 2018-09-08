import {ExpressApplication, ServerSettingsService} from "@tsed/common";
import {inject} from "@tsed/testing";
import * as Express from "express";
import * as Fs from "fs";
import {SwaggerModule} from "../../../packages/swagger/src";
import {expect, Sinon} from "../../tools";

describe("SwaggerModule", () => {
  before(
    inject(
      [SwaggerModule, ServerSettingsService, ExpressApplication],
      (swaggerModule: SwaggerModule, serverSettingsService: ServerSettingsService, expressApp: ExpressApplication) => {
        this.swaggerModule = swaggerModule;
        this.settingsService = serverSettingsService;
        this.expressApp = expressApp;
      }
    )
  );

  describe("$afterRoutesInit()", () => {
    before(() => {
      this.config = [
        {
          path: "/doc1",
          doc: "doc1",
          options: "options",
          outFile: "/path/outFile",
          showExplorer: true,
          cssPath: "cssPath",
          jsPath: "jsPath",
          hidden: false
        },
        {
          path: "/doc2",
          doc: "doc2",
          options: "options",
          outFile: null,
          showExplorer: false,
          cssPath: "cssPath",
          jsPath: "jsPath",
          hidden: true
        }
      ];

      this.expressGet = Sinon.stub(this.expressApp, "get");
      this.expressUse = Sinon.stub(this.expressApp, "use");

      this.getStub = Sinon.stub(this.settingsService, "get").returns(this.config);
      this.getOpenAPISpecStub = Sinon.stub(this.swaggerModule.swaggerService, "getOpenAPISpec").returns({spec: "spec"});
      this.createRouterStub = Sinon.stub(this.swaggerModule, "createRouter").returns({router: "router"});
      this.writeFileSyncStub = Sinon.stub(Fs, "writeFileSync");

      this.swaggerModule.$afterRoutesInit();
    });
    after(() => {
      this.expressGet.restore();
      this.expressUse.restore();
      this.getStub.restore();
      this.getOpenAPISpecStub.restore();
      this.createRouterStub.restore();
      this.writeFileSyncStub.restore();
    });

    it("it should call serviceSetting.get()", () => {
      return this.getStub.should.have.been.calledWithExactly("swagger");
    });

    it("it should call getOpenAPISpec()", () => {
      this.getOpenAPISpecStub.getCall(0).should.have.been.calledWithExactly(this.config[0]);
      this.getOpenAPISpecStub.getCall(1).should.have.been.calledWithExactly(this.config[1]);
    });

    it("it should call createRouter()", () => {
      this.createRouterStub.getCall(0).should.have.been.calledWithExactly(this.config[0], {
        spec: {spec: "spec"},
        url: "/doc1/swagger.json",
        urls: [{url: "/doc1/swagger.json", name: "doc1"}],
        showExplorer: true,
        cssPath: "cssPath",
        jsPath: "jsPath",
        swaggerOptions: "options"
      });

      this.createRouterStub.getCall(1).should.have.been.calledWithExactly(this.config[1], {
        spec: {spec: "spec"},
        url: "/doc2/swagger.json",
        urls: [{url: "/doc1/swagger.json", name: "doc1"}],
        showExplorer: false,
        cssPath: "cssPath",
        jsPath: "jsPath",
        swaggerOptions: "options"
      });
    });

    it("it should call expressApp.use", () => {
      this.expressUse.getCall(0).should.have.been.calledWithExactly("/doc1", {router: "router"});
      this.expressUse.getCall(1).should.have.been.calledWithExactly("/doc2", {router: "router"});
    });

    it("should write spec.json", () => {
      this.writeFileSyncStub.should.be.calledOnce;
      this.writeFileSyncStub.should.be.calledWithExactly("/path/outFile", JSON.stringify({spec: "spec"}, null, 2));
    });
  });

  describe("$onServerReady()", () => {
    before(() => {
      this.config = [
        {
          path: "/doc1",
          doc: "doc1",
          options: "options",
          outFile: "/path/outFile",
          showExplorer: true,
          cssPath: "cssPath",
          jsPath: "jsPath",
          hidden: false
        },
        {
          path: "/doc2",
          doc: "doc2",
          options: "options",
          outFile: null,
          showExplorer: false,
          cssPath: "cssPath",
          jsPath: "jsPath",
          hidden: true
        }
      ];
      this.getHttpPortStub = Sinon.stub(this.settingsService, "getHttpPort").returns({
        address: "0.0.0.0",
        port: 8080
      });
      this.getStub = Sinon.stub(this.settingsService, "get").returns(this.config);
      this.swaggerModule.$onServerReady();
    });
    after(() => {
      this.getHttpPortStub.restore();
      this.getStub.restore();
    });

    it("it should call getHttpPort()", () => {
      return this.getHttpPortStub.should.have.been.called;
    });
  });

  describe("createRouter()", () => {
    before(() => {
      this.routerInstance = {get: Sinon.stub(), use: Sinon.stub()};
      this.routerStub = Sinon.stub(Express, "Router").returns(this.routerInstance);
      this.staticStub = Sinon.stub(Express, "static").returns("statics");
      this.middelwareIndexStub = Sinon.stub(this.swaggerModule, "middlewareIndex").returns("indexMdlw");
      this.middelwareCsstub = Sinon.stub(this.swaggerModule, "middlewareCss").returns("cssMdlw");
      this.middelwareJstub = Sinon.stub(this.swaggerModule, "middlewareJs").returns("jsMdlw");

      this.swaggerModule.createRouter({cssPath: "cssPath", jsPath: "jsPath"}, {scope: "scope"});
    });
    after(() => {
      this.routerStub.restore();
      this.staticStub.restore();
      this.middelwareIndexStub.restore();
      this.middelwareCsstub.restore();
      this.middelwareJstub.restore();
    });

    it("should call Express.Router", () => {
      return this.routerStub.should.have.been.called;
    });

    it("should call router.get", () => {
      this.routerInstance.get.should.have.been.calledWithExactly("/swagger.json", Sinon.match.func);
      this.routerInstance.get.should.have.been.calledWithExactly("/", "indexMdlw");
      this.routerInstance.get.should.have.been.calledWithExactly("/main.js", "jsMdlw");
      this.routerInstance.get.should.have.been.calledWithExactly("/main.css", "cssMdlw");
    });

    it("should call router.use", () => {
      this.routerInstance.use.should.have.been.calledWithExactly("statics");
    });

    it("should call Express.use", () => {
      this.staticStub.should.have.been.calledWithExactly(Sinon.match("swagger-ui-dist"));
    });

    it("should call this.middlewareIndex", () => {
      this.middelwareIndexStub.should.have.been.calledWithExactly({scope: "scope"});
    });
    it("should call this.middlewareCss", () => {
      this.middelwareCsstub.should.have.been.calledWithExactly("cssPath");
    });
    it("should call this.middlewareJs", () => {
      this.middelwareJstub.should.have.been.calledWithExactly("jsPath");
    });
  });

  describe("middlewareIndex()", () => {
    before(() => {
      this.result = this.swaggerModule.middlewareIndex({scope: "scope"});
    });
    it("should return a function", () => {
      expect(this.result).to.be.a("function");
    });
  });

  describe("middlewareJs()", () => {
    before(() => {
      this.result = this.swaggerModule.middlewareJs("pathJs");
    });
    it("should return a function", () => {
      expect(this.result).to.be.a("function");
    });
  });

  describe("middlewareCss()", () => {
    before(() => {
      this.result = this.swaggerModule.middlewareJs("pathCss");
    });
    it("should return a function", () => {
      expect(this.result).to.be.a("function");
    });
  });
});
