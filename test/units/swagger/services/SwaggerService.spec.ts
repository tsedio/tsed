import {ExpressApplication, ServerSettingsService} from "@tsed/common";
import {Store} from "@tsed/core";
import {inject} from "@tsed/testing";
import * as Express from "express";
import * as Fs from "fs";
import {SwaggerService} from "../../../../packages/swagger";
import {expect, Sinon} from "../../../tools";

class Test {}

describe("SwaggerService", () => {
  before(
    inject(
      [SwaggerService, ServerSettingsService, ExpressApplication],
      (swaggerService: SwaggerService, serverSettingsService: ServerSettingsService, expressApp: ExpressApplication) => {
        this.swaggerService = swaggerService;
        this.settingsService = serverSettingsService;
        this.expressApp = expressApp;
      }
    )
  );

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
      this.swaggerService.$onServerReady();
    });
    after(() => {
      this.getHttpPortStub.restore();
      this.getStub.restore();
    });

    it("it should call getHttpPort()", () => {
      return this.getHttpPortStub.should.have.been.called;
    });
  });

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
      this.getOpenAPISpecStub = Sinon.stub(this.swaggerService, "getOpenAPISpec").returns({spec: "spec"});
      this.createRouterStub = Sinon.stub(this.swaggerService, "createRouter").returns({router: "router"});
      this.writeFileSyncStub = Sinon.stub(Fs, "writeFileSync");

      this.swaggerService.$afterRoutesInit();
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

  describe("createRouter()", () => {
    before(() => {
      this.routerInstance = {get: Sinon.stub(), use: Sinon.stub()};
      this.routerStub = Sinon.stub(Express, "Router").returns(this.routerInstance);
      this.staticStub = Sinon.stub(Express, "static").returns("statics");
      this.middelwareIndexStub = Sinon.stub(this.swaggerService, "middlewareIndex").returns("indexMdlw");
      this.middelwareCsstub = Sinon.stub(this.swaggerService, "middlewareCss").returns("cssMdlw");
      this.middelwareJstub = Sinon.stub(this.swaggerService, "middlewareJs").returns("jsMdlw");

      this.swaggerService.createRouter({cssPath: "cssPath", jsPath: "jsPath"}, {scope: "scope"});
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
      this.result = this.swaggerService.middlewareIndex({scope: "scope"});
    });
    it("should return a function", () => {
      expect(this.result).to.be.a("function");
    });
  });

  describe("middlewareJs()", () => {
    before(() => {
      this.result = this.swaggerService.middlewareJs("pathJs");
    });
    it("should return a function", () => {
      expect(this.result).to.be.a("function");
    });
  });
  describe("middlewareCss()", () => {
    before(() => {
      this.result = this.swaggerService.middlewareJs("pathCss");
    });
    it("should return a function", () => {
      expect(this.result).to.be.a("function");
    });
  });

  describe("getDefaultSpec()", () => {
    describe("when specPath is given", () => {
      before(() => {
        return (this.result = this.swaggerService.getDefaultSpec({specPath: __dirname + "/data/spec.json"}));
      });

      it("should return default spec", () => {
        this.result.should.be.deep.equals(require("./data/spec.expected.json"));
      });
    });

    describe("when nothing is given", () => {
      before(() => {
        return (this.result = this.swaggerService.getDefaultSpec({}));
      });

      it("should return default spec", () => {
        this.result.should.be.deep.equals({
          consumes: ["application/json"],
          info: {
            contact: undefined,
            description: "",
            license: undefined,
            termsOfService: "",
            title: "Api documentation",
            version: "1.0.0"
          },
          produces: ["application/json"],
          securityDefinitions: {},
          swagger: "2.0"
        });
      });
    });

    describe("when some info is given", () => {
      before(() => {
        return (this.result = this.swaggerService.getDefaultSpec({spec: {info: {}}}));
      });

      it("should return default spec", () => {
        this.result.should.be.deep.equals({
          consumes: ["application/json"],
          info: {
            contact: undefined,
            description: "",
            license: undefined,
            termsOfService: "",
            title: "Api documentation",
            version: "1.0.0"
          },
          produces: ["application/json"],
          securityDefinitions: {},
          swagger: "2.0"
        });
      });
    });
  });

  describe("buildTags()", () => {
    describe("when name is undefined", () => {
      before(() => {
        this.storeFromStub = Sinon.stub(Store, "from");
        const store = {
          get: Sinon.stub()
        };
        this.storeFromStub.returns(store);
        store.get.withArgs("description").returns("description");
        store.get.withArgs("name").returns(undefined);
        store.get.withArgs("tag").returns({test: "tag"});

        this.result = this.swaggerService.buildTags({useClass: Test});
      });
      after(() => {
        this.storeFromStub.restore();
      });

      it("should return an array with tags", () => {
        this.result.should.deep.eq({description: "description", name: "Test", test: "tag"});
      });
    });
    describe("when name is defined", () => {
      before(() => {
        this.storeFromStub = Sinon.stub(Store, "from");
        const store = {
          get: Sinon.stub()
        };
        this.storeFromStub.returns(store);
        store.get.withArgs("description").returns("description");
        store.get.withArgs("name").returns("name");
        store.get.withArgs("tag").returns({test: "tag"});

        this.result = this.swaggerService.buildTags({useClass: Test});
      });
      after(() => {
        this.storeFromStub.restore();
      });

      it("should return an array with tags", () => {
        this.result.should.deep.eq({description: "description", name: "name", test: "tag"});
      });
    });
  });

  describe("readSpecPath", () => {
    it("should return an empty object", () => {
      expect(this.swaggerService.readSpecPath("/swa.json")).to.deep.eq({});
    });
  });

  describe("getOperationId()", () => {
    before(() => {
      this.getOperationId = this.swaggerService.createOperationIdFormatter({operationIdFormat: "%c.%m"});
    });
    it("should return the right id", () => {
      expect(this.getOperationId("class", "operation")).to.deep.eq("class.operation");
    });

    it("should return the right id with increment", () => {
      expect(this.getOperationId("class", "operation")).to.deep.eq("class.operation_1");
    });
  });
});
