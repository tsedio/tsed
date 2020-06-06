import {Configuration, ExpressApplication, PlatformApplication} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Express from "express";
import * as Fs from "fs";
import * as Sinon from "sinon";
import {SwaggerModule} from "./index";

describe("SwaggerModule", () => {
  let swaggerModule: any;
  let settingsService: any;
  let app: any;

  before(() => TestContext.create());
  after(() => TestContext.reset());
  before(
    TestContext.inject(
      [SwaggerModule, Configuration, ExpressApplication],
      (swaggerModule_: SwaggerModule, configuration_: Configuration, app_: PlatformApplication) => {
        swaggerModule = swaggerModule_;
        settingsService = configuration_;
        app = app_;
      }
    )
  );
  describe("$beforeRoutesInit()", () => {
    let config: any;
    let expressGet: any;
    let expressUse: any;
    let getStub: any;
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

      expressGet = Sinon.stub(app, "get");
      expressUse = Sinon.stub(app, "use");

      getStub = Sinon.stub(settingsService, "get").returns(config);
      createRouterStub = Sinon.stub(swaggerModule, "createRouter").returns({router: "router"});
      writeFileSyncStub = Sinon.stub(Fs, "writeFileSync");

      swaggerModule.$beforeRoutesInit();
    });
    after(() => {
      expressGet.restore();
      expressUse.restore();
      getStub.restore();
      createRouterStub.restore();
      writeFileSyncStub.restore();
    });

    it("it should call serviceSetting.get()", () => {
      return getStub.should.have.been.calledWithExactly("swagger");
    });

    it("it should call createRouter()", () => {
      createRouterStub.getCall(0).should.have.been.calledWithExactly(config[0], [
        {
          url: "/doc1/swagger.json",
          name: "doc1"
        }
      ]);

      createRouterStub.getCall(1).should.have.been.calledWithExactly(config[1], [
        {
          url: "/doc1/swagger.json",
          name: "doc1"
        }
      ]);
    });

    it("it should call expressApp.use", () => {
      expressUse.getCall(0).should.have.been.calledWithExactly("/doc1", {router: "router"});
      expressUse.getCall(1).should.have.been.calledWithExactly("/doc2", {router: "router"});
    });
  });
  describe("$onRouteInit", () => {
    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
      sandbox.stub(Fs, "writeFileSync");
      sandbox.stub(settingsService, "get");
      sandbox.stub(swaggerModule.swaggerService, "getOpenAPISpec");
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should write spec.json", () => {
      // GIVEN
      const config = [
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
      settingsService.get.returns(config);
      swaggerModule.swaggerService.getOpenAPISpec.returns({spec: "spec"});

      // WHEN
      swaggerModule.$onRoutesInit();

      // THEN
      swaggerModule.swaggerService.getOpenAPISpec.getCall(0).should.have.been.calledWithExactly(config[0]);
      swaggerModule.swaggerService.getOpenAPISpec.getCall(1).should.have.been.calledWithExactly(config[1]);
      Fs.writeFileSync.should.be.calledOnceWithExactly("/path/outFile", JSON.stringify({spec: "spec"}, null, 2));
    });
  });
  describe("$onReady()", () => {
    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
      sandbox.stub(settingsService, "get");
      sandbox.stub(settingsService, "getHttpPort");
      sandbox.stub(settingsService, "getHttpsPort");
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("it should call getHttpPort()", () => {
      // GIVEN
      const config = [
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

      settingsService.getHttpPort.returns({
        address: "0.0.0.0",
        port: 8080
      });

      settingsService.get.withArgs("swagger").returns(config);
      settingsService.httpsPort = false;

      // WHEN
      swaggerModule.$onReady();

      // THEN
      return settingsService.getHttpPort.should.have.been.called;
    });
    it("it should call getHttpsPort()", () => {
      // GIVEN
      const config = [
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

      settingsService.getHttpsPort.returns({
        address: "0.0.0.0",
        port: 8081
      });

      settingsService.get.withArgs("swagger").returns(config);
      settingsService.httpsPort = 8081;

      // WHEN
      swaggerModule.$onReady();

      // THEN
      return settingsService.getHttpsPort.should.have.been.called;
    });
  });
  describe("mapSwaggerUIConfig()", () => {
    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
      sandbox.stub(swaggerModule.swaggerService, "getOpenAPISpec");
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should create spec", () => {
      // GIVEN
      const config = {
        path: "/doc2",
        doc: "doc2",
        options: "options",
        outFile: null,
        showExplorer: false,
        cssPath: "cssPath",
        jsPath: "jsPath",
        hidden: true
      };

      swaggerModule.swaggerService.getOpenAPISpec.returns({spec: "spec"});

      // WHEN
      const result = swaggerModule.mapSwaggerUIConfig(config, ["/urls"]);

      // THEN
      swaggerModule.swaggerService.getOpenAPISpec.should.have.been.calledWithExactly(config);
      result.should.deep.eq({
        cssPath: "cssPath",
        jsPath: "jsPath",
        showExplorer: false,
        spec: {
          spec: "spec"
        },
        swaggerOptions: "options",
        url: "/doc2/swagger.json",
        urls: ["/urls"]
      });
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

      swaggerModule.createRouter({cssPath: "cssPath", jsPath: "jsPath", viewPath: "viewPath"}, {scope: "scope"});
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
      middelwareIndexStub.should.have.been.calledWithExactly(
        {
          cssPath: "cssPath",
          viewPath: "viewPath",
          jsPath: "jsPath"
        },
        {scope: "scope"}
      );
    });
    it("should call middlewareCss", () => {
      middelwareCsstub.should.have.been.calledWithExactly("cssPath");
    });
    it("should call middlewareJs", () => {
      middelwareJstub.should.have.been.calledWithExactly("jsPath");
    });
  });
  describe("middlewareSwaggerJson()", () => {
    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
      sandbox.stub(swaggerModule.swaggerService, "getOpenAPISpec");
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should create spec", () => {
      // GIVEN
      const config = {
        path: "/doc2",
        doc: "doc2",
        options: "options",
        outFile: null,
        showExplorer: false,
        cssPath: "cssPath",
        jsPath: "jsPath",
        hidden: true
      };

      swaggerModule.swaggerService.getOpenAPISpec.returns({spec: "spec"});

      const req = {};
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().returnsThis()
      };
      // WHEN
      swaggerModule.middlewareSwaggerJson(config)(req, res);

      // THEN
      swaggerModule.swaggerService.getOpenAPISpec.should.have.been.calledWithExactly(config);
      res.status.should.have.been.calledWithExactly(200);
      res.json.should.have.been.calledWithExactly({spec: "spec"});
    });
  });
  describe("middlewareIndex()", () => {
    it("should return a function", () => {
      const result = swaggerModule.middlewareIndex({cssPath: "cssPath", jsPath: "jsPath"}, {scope: "scope"});
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
