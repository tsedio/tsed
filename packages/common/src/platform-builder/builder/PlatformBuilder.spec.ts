import {
  AfterInit,
  AfterListen,
  AfterRoutesInit,
  BeforeInit,
  BeforeListen,
  BeforeRoutesInit,
  Controller,
  InjectorService,
  OnReady
} from "@tsed/common";
import {Type} from "@tsed/core";
import {Configuration} from "@tsed/di";
import {join} from "path";
import * as Sinon from "sinon";
import {Platform} from "../../platform/services/Platform";
import {PlatformBuilder} from "./PlatformBuilder";

const sandbox = Sinon.createSandbox();

describe("PlatformBuilder", () => {
  @Controller("/")
  class RestCtrl {}

  class PlatformTest extends PlatformBuilder {
    static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
      return PlatformBuilder.build<PlatformTest>(this).bootstrap(module, settings);
    }

    async loadStatics(): Promise<void> {
      return undefined;
    }
  }

  @Configuration({
    logger: {
      level: "off"
    },
    mount: {
      "/rest": [RestCtrl]
    }
  })
  class ServerModule implements BeforeInit, AfterInit, BeforeRoutesInit, AfterRoutesInit, BeforeListen, AfterListen, OnReady {
    $onInit(): Promise<any> | void {
      return undefined;
    }

    $beforeRoutesInit(): void | Promise<any> {
      return undefined;
    }

    $afterRoutesInit(): void | Promise<any> {
      return undefined;
    }

    $afterInit(): void | Promise<any> {
      return undefined;
    }

    $afterListen(): void | Promise<any> {
      return undefined;
    }

    $beforeInit(): void | Promise<any> {
      return undefined;
    }

    $beforeListen(): void | Promise<any> {
      return undefined;
    }

    $onReady(): void | Promise<any> {
      return undefined;
    }
  }

  beforeEach(() => {
    sandbox.stub(ServerModule.prototype, "$onInit");
    sandbox.stub(ServerModule.prototype, "$beforeRoutesInit");
    sandbox.stub(ServerModule.prototype, "$afterRoutesInit");
    sandbox.stub(ServerModule.prototype, "$afterInit");
    sandbox.stub(ServerModule.prototype, "$afterListen");
    sandbox.stub(ServerModule.prototype, "$beforeInit");
    sandbox.stub(ServerModule.prototype, "$beforeListen");
    sandbox.stub(ServerModule.prototype, "$onReady");
    sandbox.stub(PlatformTest.prototype, "loadStatics");
    // @ts-ignore
    sandbox.spy(PlatformTest.prototype, "listenServers");
    sandbox.stub(InjectorService.prototype, "emit");
    sandbox.stub(Platform.prototype, "addRoutes");
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe("bootstrap()", () => {
    it("should bootstrap platform", async () => {
      // WHEN
      const server = await PlatformTest.bootstrap(ServerModule, {
        httpPort: false,
        httpsPort: false
      });

      // THEN
      server.rootModule.$onInit.should.have.been.calledWithExactly();
      server.rootModule.$beforeRoutesInit.should.have.been.calledWithExactly();
      server.rootModule.$afterRoutesInit.should.have.been.calledWithExactly();
      server.rootModule.$afterInit.should.have.been.calledWithExactly();
      server.rootModule.$beforeInit.should.have.been.calledWithExactly();
      server.injector.emit.should.have.been.calledWithExactly("$beforeRoutesInit");
      server.injector.emit.should.have.been.calledWithExactly("$afterRoutesInit");
      server.injector.emit.should.not.have.been.calledWithExactly("$afterInit");
      server.injector.emit.should.not.have.been.calledWithExactly("$onInit");
      server.injector.emit.should.not.have.been.calledWithExactly("$beforeInit");

      await server.listen();
      // THEN
      // @ts-ignore
      server.listenServers.should.have.been.calledWithExactly();
      server.loadStatics.should.have.been.calledWithExactly();
      server.rootModule.$afterListen.should.have.been.calledWithExactly();
      server.rootModule.$beforeListen.should.have.been.calledWithExactly();
      server.rootModule.$onReady.should.have.been.calledWithExactly();
      server.injector.emit.should.have.been.calledWithExactly("$afterListen");
      server.injector.emit.should.have.been.calledWithExactly("$beforeListen");
      server.injector.emit.should.have.been.calledWithExactly("$onServerReady");
      server.injector.emit.should.have.been.calledWithExactly("$onReady");

      // THEN
      server.rootModule.should.be.instanceOf(ServerModule);
      server.platform.addRoutes.should.have.been.calledWithExactly([
        {
          route: "/rest",
          token: RestCtrl
        }
      ]);
    });
  });

  describe("addComponents", () => {
    it("should add components", async () => {
      // GIVEN
      const server = await PlatformTest.bootstrap(ServerModule, {});

      class MyClass {}

      // WHEN
      server.addComponents(MyClass);

      // THEN
      server.injector.settings.componentsScan.should.deep.eq([
        join(process.cwd(), "mvc/**/*.ts"),
        join(process.cwd(), "services/**/*.ts"),
        join(process.cwd(), "middlewares/**/*.ts"),
        join(process.cwd(), "converters/**/*.ts"),
        MyClass
      ]);
    });
  });
  describe("addControllers", () => {
    it("should add controllers", async () => {
      // GIVEN
      const server = await PlatformTest.bootstrap(ServerModule, {});

      class MyClass {}

      // WHEN
      server.addControllers("/test", MyClass);

      // THEN
      server.injector.settings.mount["/test"].should.deep.eq([MyClass]);
    });
  });
});
