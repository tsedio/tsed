import {Configuration, ExpressApplication} from "@tsed/common";
import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Express from "express";
import * as Fs from "fs";
import * as Sinon from "sinon";
import {SwaggerModule} from "../src";

describe("SwaggerModule", () => {
  let swaggerModule: any;
  let settingsService: any;
  let expressApp: any;
  before(
    inject(
      [SwaggerModule, Configuration, ExpressApplication],
      (swaggerModule_: SwaggerModule, configuration_: Configuration, expressApp_: ExpressApplication) => {
        swaggerModule = swaggerModule_;
        settingsService = configuration_;
        expressApp = expressApp_;
      }
    )
  );

  describe("$onRoutesInit()", () => {
    let config: any;
    let expressGet: any;
    let expressUse: any;
    let getStub: any;
    let getOpenAPISpecStub: any;
    let createRouterStub: any;
    let writeFileSyncStub: any;
    before(() => {
      config = [
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

      expressGet = Sinon.stub(expressApp, "get");
      expressUse = Sinon.stub(expressApp, "use");

      getStub = Sinon.stub(settingsService, "get").returns(config);
      getOpenAPISpecStub = Sinon.stub(swaggerModule.swaggerService, "getOpenAPISpec").returns({spec: "spec"});
      createRouterStub = Sinon.stub(swaggerModule, "createRouter").returns({router: "router"});
      writeFileSyncStub = Sinon.stub(Fs, "writeFileSync");

      swaggerModule.$onRoutesInit();
    });
    after(() => {
      expressGet.restore();
      expressUse.restore();
      getStub.restore();
      getOpenAPISpecStub.restore();
      createRouterStub.restore();
      writeFileSyncStub.restore();
    });

    it("it should call serviceSetting.get()", () => {
      return getStub.should.have.been.calledWithExactly("swagger");
    });

    it("it should call getOpenAPISpec()", () => {
      getOpenAPISpecStub.getCall(0).should.have.been.calledWithExactly(config[0]);
      getOpenAPISpecStub.getCall(1).should.have.been.calledWithExactly(config[1]);
    });

    it("it should call createRouter()", () => {
      createRouterStub.getCall(0).should.have.been.calledWithExactly(config[0], {
        spec: {spec: "spec"},
        url: "/doc1/swagger.json",
        urls: [{url: "/doc1/swagger.json", name: "doc1"}],
        showExplorer: true,
        cssPath: "cssPath",
        jsPath: "jsPath",
        swaggerOptions: "options"
      });

      createRouterStub.getCall(1).should.have.been.calledWithExactly(config[1], {
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
      expressUse.getCall(0).should.have.been.calledWithExactly("/doc1", {router: "router"});
      expressUse.getCall(1).should.have.been.calledWithExactly("/doc2", {router: "router"});
    });

    it("should write spec.json", () => {
      writeFileSyncStub.should.be.calledOnce;
      writeFileSyncStub.should.be.calledWithExactly("/path/outFile", JSON.stringify({spec: "spec"}, null, 2));
    });
  });

  describe("$onReady()", () => {
    let config: any;
    let getHttpPortStub: any;
    let getStub: any;
    before(() => {
      config = [
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
      getHttpPortStub = Sinon.stub(settingsService, "getHttpPort").returns({
        address: "0.0.0.0",
        port: 8080
      });
      getStub = Sinon.stub(settingsService, "get").returns(config);
      swaggerModule.$onReady();
    });
    after(() => {
      getHttpPortStub.restore();
      getStub.restore();
    });

    it("it should call getHttpPort()", () => {
      return getHttpPortStub.should.have.been.called;
    });
  });

  describe("createRouter()", () => {
    let routerInstance: any;
    let routerStub: any;
    let staticStub: any;
    let middelwareIndexStub: any;
    let middelwareCsstub: any;
    let middelwareJstub: any;
    before(() => {
      routerInstance = {get: Sinon.stub(), use: Sinon.stub()};
      routerStub = Sinon.stub(Express, "Router").returns(routerInstance);
      staticStub = Sinon.stub(Express, "static").returns(() => "static");
      middelwareIndexStub = Sinon.stub(swaggerModule, "middlewareIndex").returns("indexMdlw");
      middelwareCsstub = Sinon.stub(swaggerModule, "middlewareCss").returns("cssMdlw");
      middelwareJstub = Sinon.stub(swaggerModule, "middlewareJs").returns("jsMdlw");

      swaggerModule.createRouter({cssPath: "cssPath", jsPath: "jsPath"}, {scope: "scope"});
    });
    after(() => {
      routerStub.restore();
      staticStub.restore();
      middelwareIndexStub.restore();
      middelwareCsstub.restore();
      middelwareJstub.restore();
    });

    it("should call Express.Router", () => {
      return routerStub.should.have.been.called;
    });

    it("should call router.get", () => {
      routerInstance.get.should.have.been.calledWithExactly("/swagger.json", Sinon.match.func);
      routerInstance.get.should.have.been.calledWithExactly("/", "indexMdlw");
      routerInstance.get.should.have.been.calledWithExactly("/main.js", "jsMdlw");
      routerInstance.get.should.have.been.calledWithExactly("/main.css", "cssMdlw");
    });

    it("should call router.use", () => {
      routerInstance.use.should.have.been.calledWithExactly(Sinon.match.func);
    });

    it("should call Express.use", () => {
      staticStub.should.have.been.calledWithExactly(Sinon.match("swagger-ui-dist"));
    });

    it("should call middlewareIndex", () => {
      middelwareIndexStub.should.have.been.calledWithExactly({scope: "scope"});
    });
    it("should call middlewareCss", () => {
      middelwareCsstub.should.have.been.calledWithExactly("cssPath");
    });
    it("should call middlewareJs", () => {
      middelwareJstub.should.have.been.calledWithExactly("jsPath");
    });
  });

  describe("middlewareIndex()", () => {
    it("should return a function", () => {
      const result = swaggerModule.middlewareIndex({scope: "scope"});
      expect(result).to.be.a("function");
    });
  });

  describe("middlewareJs()", () => {
    it("should return a function", () => {
      const result = swaggerModule.middlewareJs("pathJs");
      expect(result).to.be.a("function");
    });
  });

  describe("middlewareCss()", () => {
    it("should return a function", () => {
      const result = swaggerModule.middlewareJs("pathCss");
      expect(result).to.be.a("function");
    });
  });
});
