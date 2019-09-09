import {expect} from "chai";
import * as Sinon from "sinon";
import {$logStub} from "../../../../../test/helper/tools";
import {Configuration, getConfiguration, RouteService, ServerLoader, ServerSettings} from "../../../src";

describe("ServerLoader", () => {
  const serverSandbox = Sinon.createSandbox();
  let server: any;

  before(() => {
    @ServerSettings({debug: true, port: 8000, httpsPort: 8080})
    class TestServer extends ServerLoader {
      $onInit() {
      }

      $onReady() {
      }

      $beforeRoutesInit() {
      }

      $onMountingMiddlewares() {
        // deprecated
      }

      $afterRoutesInit() {
      }
    }

    server = new TestServer();
    server.settings.httpPort = 8080;
    server.settings.httpsPort = 8000;
    serverSandbox.stub(server.expressApp, "use");
    serverSandbox.stub(server.expressApp, "set");
    serverSandbox.stub(server.expressApp, "engine");
  });

  after(() => {
    serverSandbox.restore();
  });

  describe("startServer()", () => {
    let createServerStub: any;
    before(() => {
      createServerStub = {
        on: Sinon.stub(),
        listen: Sinon.stub(),
        address: Sinon.stub().returns({port: 8080})
      };

      createServerStub.on.returns(createServerStub);
      const promise = server.startServer(createServerStub, {address: "0.0.0.0", port: 8080});
      createServerStub.on.getCall(0).args[1]();

      return promise;
    });

    it("should have been called server.listen with the correct params", () => {
      createServerStub.listen.should.have.been.calledWithExactly(8080, "0.0.0.0");
    });

    it("should have been called server.on with the correct params", () => {
      createServerStub.on.should.have.been.calledWithExactly("listening", Sinon.match.func);
      createServerStub.on.should.have.been.calledWithExactly("error", Sinon.match.func);
    });
  });

  describe("loadMiddlewares()", () => {
    const sandbox = Sinon.createSandbox();
    before(() => {
      sandbox.stub(server, "$onMountingMiddlewares");
      sandbox.stub(server, "$beforeRoutesInit");
      sandbox.stub(server, "$afterRoutesInit");
      sandbox.stub(server, "injectorService");
    });

    after(() => {
      serverSandbox.resetHistory();
      sandbox.restore();
    });

    it("should load middlewares and init routes", async () => {
      // GIVEN
      server.$beforeRoutesInit.resolves();
      server.$onMountingMiddlewares.resolves();
      server.$afterRoutesInit.resolves();

      server.routes = [{
        route: "/", token: class {
        }
      }];

      server.injectorService.addProvider(RouteService, {
        useFactory() {
          return {
            addRoutes: sandbox.stub(),
            getRoutes: sandbox.stub().returns([])
          };
        }
      });

      // WHEN
      await server.loadSettingsAndInjector();

      sandbox.spy(server.injectorService, "emit");

      await server.loadMiddlewares();

      server.injectorService.emit.should.have.been.calledWithExactly("$beforeRoutesInit");
      server.injectorService.emit.should.have.been.calledWithExactly("$onRoutesInit");
      server.injectorService.emit.should.have.been.calledWithExactly("$afterRoutesInit");

      server.routes = [];

      return server.$beforeRoutesInit.should.have.been.calledOnce && server.$onMountingMiddlewares.should.have.been.calledOnce && server.$afterRoutesInit.should.have.been.calledOnce;
    });
  });

  describe("scan()", () => {
    it("should add new path to componentScan", () => {
      server.scan(require("path").join(__dirname, "/data/*.ts"), "/context");

      return server.settings.mount["/context"].should.exist;
    });

    it("should add symbol to componentScan", () => {
      server.scan(require("path").join(__dirname, "/data/*.ts"));

      return server.settings.mount["/context"].should.exist;
    });
  });

  describe("mount()", () => {
    const sandbox = Sinon.createSandbox();
    before(() => {
      sandbox.stub(server, "addControllers");
    });
    after(() => {
      sandbox.restore();
    });
    it("should add endpoint", () => {
      // GIVEN
      class Test {
      }

      // WHEN
      server.mount("/", [Test]);

      // THEN
      server.addControllers.should.have.been.calledWithExactly("/", [Test]);
    });
  });

  describe("start()", () => {
    describe("when success", () => {
      const sandbox = Sinon.createSandbox();
      before(() => {
        $logStub.$log.info.reset();
        sandbox.stub(server, "startServer").returns(
          Promise.resolve({
            address: "0.0.0.0",
            port: 8080
          })
        );
        sandbox.spy(server, "loadSettingsAndInjector");
        sandbox.spy(server, "loadMiddlewares");
        sandbox.stub(server, "$onInit").resolves();
        sandbox.stub(server, "$onReady").resolves();

        return server.start();
      });

      after(() => {
        $logStub.$log.info.reset();
        sandbox.restore();
      });

      it("should have been called onInit hook", () => server.$onInit.should.have.been.calledOnce);
      it("should have been called loadSettingsAndInjector", () => server.loadSettingsAndInjector.should.have.been.calledOnce);

      it("should have been called loadMiddlewares", () => server.loadMiddlewares.should.have.been.calledOnce);

      it("should have been called $onReady hook", () => server.$onReady.should.have.been.calledOnce);

      it("should have been called startServer() with the right parameters", () => {
        server.startServer.should.have.been.calledTwice
          .and
          .calledWithExactly(server.httpServer, {
            address: "0.0.0.0",
            https: false,
            port: 8080
          })
          .and
          .calledWithExactly(server.httpsServer, {
            address: "0.0.0.0",
            https: true,
            port: 8000
          });
      });
    });
    describe("when error", () => {
      const sandbox = Sinon.createSandbox();
      let error: any;
      before(() => {
        error = new Error("onInit");
        sandbox.stub(server, "loadSettingsAndInjector").returns(Promise.reject(error));

        $logStub.$log.error.reset();

        return server.start().catch((err: any) => {
        });
      });

      after(() => {
        sandbox.restore();
        $logStub.$log.error.reset();
      });

      it("should have been called loadSettingsAndInjector", () => server.loadSettingsAndInjector.should.have.been.called);
    });
  });

  describe("set()", () => {
    before(() => {
      server.set("view engine", "html");
    });

    it("should call express.set() with the right parameters", () => {
      server.expressApp.set.should.have.been.calledWithExactly("view engine", "html");
    });
  });

  describe("engine()", () => {
    before(() => {
      server.engine("jade", () => {
      });
    });

    it("should call express.engine() with the right parameters", () => {
      server.expressApp.engine.should.have.been.calledWithExactly("jade", Sinon.match.func);
    });
  });

  describe("bootstrap()", () => {
    it("should bootstrap server", async () => {
      // GIVEN
      @ServerSettings()
      class TestServer extends ServerLoader {
        $onInit() {
        }

        $onReady() {
        }

        $beforeRoutesInit() {

        }

        $onMountingMiddlewares() {
        }

        $afterRoutesInit() {
        }
      }

      // WHEN
      const server = await ServerLoader.bootstrap(TestServer, {
        ownSettings: "test"
      });

      // THEN
      expect(server).to.be.instanceof(TestServer);
      expect(server.listen).to.be.a("function");
      expect(server.settings.get("ownSettings")).to.eq("test");
    });
  });
});
