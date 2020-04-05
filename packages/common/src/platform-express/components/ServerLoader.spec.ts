import {expect} from "chai";
import * as Sinon from "sinon";
import {$logStub} from "../../../../../test/helper/tools";
import {ServerLoader, ServerSettings} from "../../../src";

function createServer() {
  @ServerSettings({debug: true, port: 8000, httpsPort: 8080})
  class TestServer extends ServerLoader {
    $onInit() {}

    $onReady() {}

    $beforeRoutesInit() {}

    $onMountingMiddlewares() {
      // deprecated
    }

    $afterRoutesInit() {}
  }

  const server = new TestServer();
  server.settings.httpPort = 8080;
  server.settings.httpsPort = 8000;

  const serverSandbox = Sinon.createSandbox();

  serverSandbox.stub(server.expressApp, "use");
  serverSandbox.stub(server.expressApp, "set");
  serverSandbox.stub(server.expressApp, "engine");

  return {serverSandbox, server};
}

describe("ServerLoader", () => {
  describe("mount()", () => {
    const sandbox = Sinon.createSandbox();
    const {server, serverSandbox} = createServer();
    before(() => {
      sandbox.stub(server, "addControllers");
    });
    after(() => {
      sandbox.restore();
    });
    it("should add endpoint", () => {
      // GIVEN
      class Test {}

      // WHEN
      server.mount("/", [Test]);

      // THEN
      server.addControllers.should.have.been.calledWithExactly("/", [Test]);
    });
  });

  describe("start()", () => {
    const {server, serverSandbox} = createServer();
    describe("when success", () => {
      const sandbox = Sinon.createSandbox();
      before(() => {
        $logStub.$log.info.reset();
        // @ts-ignore
        sandbox.stub(server, "listenServers");
        // @ts-ignore
        sandbox.spy(server, "loadSettingsAndInjector");
        // @ts-ignore
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
      it("should have been called loadSettingsAndInjector", () => {
        // @ts-ignore
        return server.loadSettingsAndInjector.should.have.been.calledOnce;
      });

      it("should have been called loadMiddlewares", () => {
        // @ts-ignore
        server.loadMiddlewares.should.have.been.calledOnce;
      });

      it("should have been called $onReady hook", () => server.$onReady.should.have.been.calledOnce);

      it("should have been called listenServers() with the right parameters", () => {
        // @ts-ignore
        return server.listenServers.should.have.been.called;
      });
    });
    describe("when error", () => {
      const sandbox = Sinon.createSandbox();
      let error: any;
      before(() => {
        error = new Error("onInit");
        // @ts-ignore
        sandbox.stub(server, "loadSettingsAndInjector").returns(Promise.reject(error));

        $logStub.$log.error.reset();

        return server.start().catch((err: any) => {});
      });

      after(() => {
        sandbox.restore();
        $logStub.$log.error.reset();
      });

      it("should have been called loadSettingsAndInjector", () => {
        // @ts-ignore
        return server.loadSettingsAndInjector.should.have.been.called;
      });
    });
  });

  describe("set()", () => {
    const {server, serverSandbox} = createServer();
    before(() => {
      server.set("view engine", "html");
    });

    it("should call express.set() with the right parameters", () => {
      server.expressApp.set.should.have.been.calledWithExactly("view engine", "html");
    });
  });

  describe("engine()", () => {
    const {server, serverSandbox} = createServer();
    before(() => {
      server.engine("jade", () => {});
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
        $onInit() {}

        $onReady() {}

        $beforeRoutesInit() {}

        $onMountingMiddlewares() {}

        $afterRoutesInit() {}
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
