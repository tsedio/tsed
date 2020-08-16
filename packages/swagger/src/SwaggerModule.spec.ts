import {Configuration, PlatformApplication, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Express from "express";
import * as Fs from "fs";
import * as Sinon from "sinon";
import {SwaggerModule} from "./index";

const sandbox = Sinon.createSandbox();
describe("SwaggerModule", () => {
  let swaggerModule: any;
  let settingsService: any;
  let app: any;

  before(() => PlatformTest.create());
  after(() => PlatformTest.reset());
  before(
    PlatformTest.inject(
      [SwaggerModule, Configuration, PlatformApplication],
      (swaggerModule_: SwaggerModule, configuration_: Configuration, app_: PlatformApplication) => {
        swaggerModule = swaggerModule_;
        settingsService = configuration_;
        app = app_.raw;
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
      return expect(getStub).to.have.been.calledWithExactly("swagger");
    });

    it("it should call createRouter()", () => {
      expect(createRouterStub.getCall(0)).to.have.been.calledWithExactly(config[0], [
        {
          url: "/doc1/swagger.json",
          name: "doc1"
        }
      ]);

      expect(createRouterStub.getCall(1)).to.have.been.calledWithExactly(config[1], [
        {
          url: "/doc1/swagger.json",
          name: "doc1"
        }
      ]);
    });

    it("it should call expressApp.use", () => {
      expect(expressUse.getCall(0)).to.have.been.calledWithExactly("/doc1", {router: "router"});
      expect(expressUse.getCall(1)).to.have.been.calledWithExactly("/doc2", {router: "router"});
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
      expect(swaggerModule.swaggerService.getOpenAPISpec.getCall(0)).to.have.been.calledWithExactly(config[0]);
      expect(swaggerModule.swaggerService.getOpenAPISpec.getCall(1)).to.have.been.calledWithExactly(config[1]);
      expect(Fs.writeFileSync).to.have.been.calledOnceWithExactly("/path/outFile", JSON.stringify({spec: "spec"}, null, 2));
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
      return expect(settingsService.getHttpPort).to.have.been.calledWithExactly();
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
      return expect(settingsService.getHttpsPort).to.have.been.calledWithExactly();
    });
  });
  describe("createRouter()", () => {
    const routerInstance = {get: sandbox.stub(), use: sandbox.stub()};
    before(() => {
      sandbox.stub(Express, "Router").returns(routerInstance as any);
      sandbox.stub(Express, "static").returns(() => "static");
      swaggerModule.createRouter({cssPath: "cssPath", jsPath: "jsPath", viewPath: "viewPath"}, {scope: "scope"});
    });
    after(() => {
      sandbox.restore();
    });

    it("should call Express.Router", () => {
      return expect(Express.Router).to.have.been.calledWithExactly();
    });

    it("should call router.get", () => {
      expect(routerInstance.get).to.have.been.calledWithExactly("/swagger.json", Sinon.match.func);
      expect(routerInstance.get).to.have.been.calledWithExactly("/", Sinon.match.func);
      expect(routerInstance.get).to.have.been.calledWithExactly("/main.js", Sinon.match.func);
      expect(routerInstance.get).to.have.been.calledWithExactly("/main.css", Sinon.match.func);
    });

    it("should call router.use", () => {
      expect(routerInstance.use).to.have.been.calledWithExactly(Sinon.match.func);
    });

    it("should call Express.use", () => {
      expect(Express.static).to.have.been.calledWithExactly(Sinon.match("swagger-ui-dist"));
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
      expect(swaggerModule.swaggerService.getOpenAPISpec).to.have.been.calledWithExactly(config);
      expect(res.status).to.have.been.calledWithExactly(200);
      expect(res.json).to.have.been.calledWithExactly({spec: "spec"});
    });
  });
});
