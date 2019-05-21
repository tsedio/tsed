import {Metadata} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {$logStub} from "../../../../../test/helper/tools";
import {SERVER_SETTINGS} from "../../../src/config/constants";
import {ServerLoader} from "../../../src/server";

describe("ServerLoader", () => {
  before(() => {
    class TestServer extends ServerLoader {
      $onInit() {
      }

      $onReady() {
      }

      $onMountingMiddlewares() {
      }

      $afterRoutesInit() {
      }
    }

    Metadata.set(SERVER_SETTINGS, {debug: true, port: 8000, httpsPort: 8080}, TestServer);

    this.server = new TestServer();
    this.server.settings.httpPort = 8080;
    this.server.settings.httpsPort = 8000;
    this.useStub = Sinon.stub(this.server.expressApp, "use");
    this.setStub = Sinon.stub(this.server.expressApp, "set");
    this.engineStub = Sinon.stub(this.server.expressApp, "engine");
  });

  after(() => {
    this.useStub.restore();
    this.setStub.restore();
    this.engineStub.restore();
  });

  describe("startServer()", () => {
    before(() => {
      this.createServerStub = {
        on: Sinon.stub(),
        listen: Sinon.stub(),
        address: Sinon.stub().returns({port: 8080})
      };

      this.createServerStub.on.returns(this.createServerStub);
      this.promise = this.server.startServer(this.createServerStub, {address: "0.0.0.0", port: 8080});
      this.createServerStub.on.getCall(0).args[1]();

      return this.promise;
    });

    it("should have been called server.listen with the correct params", () => {
      this.createServerStub.listen.should.have.been.calledWithExactly(8080, "0.0.0.0");
    });

    it("should have been called server.on with the correct params", () => {
      this.createServerStub.on.should.have.been.calledWithExactly("listening", Sinon.match.func);
      this.createServerStub.on.should.have.been.calledWithExactly("error", Sinon.match.func);
    });
  });

  describe("loadMiddlewares()", () => {
    before(() => {
      this.useStub.reset();
      this.$onMountingMiddlewares = Sinon.stub(this.server, "$onMountingMiddlewares").resolves();
      this.$afterRoutesInit = Sinon.stub(this.server, "$afterRoutesInit").resolves();

      this.server.loadSettingsAndInjector();

      this.emitSpy = Sinon.spy(this.server.injectorService, "emit");

      return this.server.loadMiddlewares();
    });

    after(() => {
      this.useStub.reset();
      this.$onMountingMiddlewares.restore();
      this.$afterRoutesInit.restore();
      this.emitSpy.restore();
    });

    it("should have been called $onMountingMiddlewares hook", () => this.$onMountingMiddlewares.should.have.been.calledOnce);

    it("should have been emit $onRoutesInit event", () =>
      this.emitSpy.should.have.been.calledWithExactly("$onRoutesInit", Sinon.match.array));
    it("should have been emit $onRoutesInit event", () => this.emitSpy.should.have.been.calledWithExactly("$afterRoutesInit"));

    it("should have been called $afterRoutesInit hook", () => this.$afterRoutesInit.should.have.been.calledOnce);
  });

  describe("scan()", () => {
    before(() => {
      this.server.scan(require("path").join(__dirname, "/data/*.ts"), "/context");
    });

    it("should require components", () => {
      expect(this.server._components)
        .to.be.an("array")
        .and.length(1);
    });

    it("should have classes attributs", () => {
      expect(this.server._components[0].classes[0]).to.be.a("function");
    });

    it("should have endpoint attributs", () => {
      expect(this.server._components[0].endpoint).to.eq("/context");
    });
  });

  describe("mount()", () => {
    describe("when we give a single path", () => {
      before(() => {
        this.scanStub = Sinon.stub(this.server, "scan");

        this.server.mount("endpoint", "path/to/*.js");
      });

      after(() => {
        this.scanStub.restore();
      });

      it("should have been called the scan method", () => {
        this.scanStub.should.be.calledOnce.and.calledWithExactly(["path/to/*.js"], "endpoint");
      });
    });
    describe("when we give an array of path", () => {
      before(() => {
        this.scanStub = Sinon.stub(this.server, "scan");

        this.server.mount("endpoint", ["path/to/*.js", "path2/to/*.js"]);
      });

      after(() => {
        this.scanStub.restore();
      });

      it("should have been called the scan method", () => {
        this.scanStub.should.be.calledWithExactly(["path/to/*.js", "path2/to/*.js"], "endpoint");
      });
    });

    describe("when we give a class", () => {
      before(() => {
        this.classTest = class {
        };
        this.addComponentsStub = Sinon.stub(this.server, "addComponents");

        this.server.mount("endpoint", [this.classTest]);
      });

      after(() => {
        this.addComponentsStub.restore();
      });

      it("should have been called the addComponents method", () => {
        this.addComponentsStub.should.be.calledOnce.and.calledWithExactly([this.classTest], {endpoint: "endpoint"});
      });
    });
  });

  describe("start()", () => {
    describe("when success", () => {
      before(() => {
        $logStub.$log.info.reset();
        this.startServerStub = Sinon.stub(this.server, "startServer").returns(
          Promise.resolve({
            address: "0.0.0.0",
            port: 8080
          })
        );
        this.loadSettingsAndInjectorSpy = Sinon.spy(this.server, "loadSettingsAndInjector");
        this.loadMiddlewaresSpy = Sinon.spy(this.server, "loadMiddlewares");
        this.$onInitStub = Sinon.stub(this.server, "$onInit").resolves();
        this.$onReadyStub = Sinon.stub(this.server, "$onReady").resolves();

        return this.server.start();
      });

      after(() => {
        $logStub.$log.info.reset();
        this.loadSettingsAndInjectorSpy.restore();
        this.loadMiddlewaresSpy.restore();
        this.$onInitStub.restore();
        this.$onReadyStub.restore();
        this.startServerStub.restore();
      });

      it("should have been called onInit hook", () => this.$onInitStub.should.have.been.calledOnce);
      it("should have been called loadSettingsAndInjector", () => this.loadSettingsAndInjectorSpy.should.have.been.calledOnce);

      it("should have been called loadMiddlewares", () => this.loadMiddlewaresSpy.should.have.been.calledOnce);

      it("should have been called $onReady hook", () => this.$onReadyStub.should.have.been.calledOnce);

      it("should have been called startServer() with the right parameters", () => {
        this.startServerStub.should.have.been.calledTwice;
        this.startServerStub.should.have.been.calledWithExactly(this.server.httpServer, {
          address: "0.0.0.0",
          https: false,
          port: 8080
        });

        this.startServerStub.should.have.been.calledWithExactly(this.server.httpsServer, {
          address: "0.0.0.0",
          https: true,
          port: 8000
        });
      });
    });
    describe("when error", () => {
      before(() => {
        this.error = new Error("onInit");
        this.loadSettingsAndInjectorSpy = Sinon.stub(this.server, "loadSettingsAndInjector").returns(Promise.reject(this.error));

        $logStub.$log.error.reset();

        return this.server.start().catch((err: any) => {
        });
      });

      after(() => {
        this.loadSettingsAndInjectorSpy.restore();
        this.$onReadyStub.restore();
        this.startServerStub.restore();
        $logStub.$log.error.reset();
      });

      it("should have been called loadSettingsAndInjector", () => this.loadSettingsAndInjectorSpy.should.have.been.called);
    });
  });

  describe("set()", () => {
    before(() => {
      this.server.set("view engine", "html");
    });

    it("should call express.set() with the right parameters", () => {
      this.setStub.should.have.been.calledWithExactly("view engine", "html");
    });
  });

  describe("engine()", () => {
    before(() => {
      this.server.engine("jade", () => {
      });
    });

    it("should call express.engine() with the right parameters", () => {
      this.engineStub.should.have.been.calledWithExactly("jade", Sinon.match.func);
    });
  });

  describe("cleanGlobPatterns()", () => {
    before(() => {
      this.compilerBackup = require.extensions[".ts"];
    });
    after(() => {
      require.extensions[".ts"] = this.compilerBackup;
    });
    describe("when haven't typescript compiler", () => {
      before(() => {
        this.compiler = require.extensions[".ts"];
        delete require.extensions[".ts"];
      });
      after(() => {
        require.extensions[".ts"] = this.compiler;
      });
      it("should return file.js", () => {
        expect(ServerLoader.cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).to.contains("file.js");
      });

      it("should return file.ts.js and manipulate only the file extension", () => {
        expect(ServerLoader.cleanGlobPatterns("file.ts.ts", ["!**.spec.ts"])[0]).to.contains("file.ts.js");
      });
    });
    describe("when have typescript compiler", () => {
      before(() => {
        this.compiler = require.extensions[".ts"];
        require.extensions[".ts"] = () => {
        };
      });
      after(() => {
        delete require.extensions[".ts"];
        require.extensions[".ts"] = this.compiler;
      });
      it("should return file.ts", () => {
        expect(ServerLoader.cleanGlobPatterns("file.ts", ["!**.spec.ts"])[0]).to.contains("file.ts");
      });
    });
  });
});
