import {
  AfterInit,
  AfterListen,
  AfterRoutesInit,
  BeforeInit,
  BeforeListen,
  BeforeRoutesInit,
  Controller,
  Injectable,
  InjectorService,
  Module,
  normalizePath,
  OnReady,
  PlatformAdapter
} from "@tsed/common";
import {Type} from "@tsed/core";
import {Configuration} from "@tsed/di";
import {expect} from "chai";
import {join, resolve} from "path";
import Sinon from "sinon";
import {Platform} from "../services/Platform";
import {PlatformBuilder} from "./PlatformBuilder";
import {FakeAdapter} from "../services/FakeAdapter";

const sandbox = Sinon.createSandbox();

describe("PlatformBuilder", () => {
  @Controller("/")
  class RestCtrl {}

  class PlatformCustom extends FakeAdapter {
    readonly providers = [
      {
        provide: class Test {}
      }
    ];

    constructor(private platform: PlatformBuilder) {
      super();
    }

    static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
      return PlatformBuilder.create<any, any>(module, {
        ...settings,
        adapter: PlatformCustom
      });
    }

    static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
      return PlatformBuilder.build(module, {
        ...settings,
        adapter: PlatformCustom
      }).bootstrap();
    }

    afterLoadRoutes(): Promise<any> {
      return Promise.resolve(undefined);
    }

    beforeLoadRoutes(): Promise<any> {
      return Promise.resolve(undefined);
    }

    useContext(): any {}

    useRouter(): any {}
  }

  @Controller("/")
  class HealthCtrl {}

  @Module({
    mount: {
      "/heath": [HealthCtrl]
    }
  })
  class HealthModule {}

  const settings = {
    logger: {
      level: "off"
    },
    mount: {
      "/rest": [RestCtrl]
    },
    acceptMimes: ["application/json"],
    imports: [HealthModule]
  };

  @Configuration(settings as any)
  class ServerModule implements BeforeInit, AfterInit, BeforeRoutesInit, AfterRoutesInit, BeforeListen, AfterListen, OnReady {
    constructor() {}

    $beforeRoutesInit(): void | Promise<any> {
      return undefined;
    }

    $afterRoutesInit(): void | Promise<any> {
      console.log("$afterRoutesInit");
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
    sandbox.stub(ServerModule.prototype, "$beforeRoutesInit");
    sandbox.stub(ServerModule.prototype, "$afterRoutesInit");
    sandbox.stub(ServerModule.prototype, "$afterInit");
    sandbox.stub(ServerModule.prototype, "$afterListen");
    sandbox.stub(ServerModule.prototype, "$beforeInit");
    sandbox.stub(ServerModule.prototype, "$beforeListen");
    sandbox.stub(ServerModule.prototype, "$onReady");
    sandbox.stub(PlatformBuilder.prototype, "loadStatics");
    // @ts-ignore
    sandbox.spy(PlatformBuilder.prototype, "listenServers");
    sandbox.stub(InjectorService.prototype, "emit");
    sandbox.stub(Platform.prototype, "addRoutes");
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe("static boostrap()", () => {
    beforeEach(() => {
      sandbox.stub(PlatformBuilder, "build").returns({
        bootstrap: sandbox.stub()
      } as any);
    });
    afterEach(() => {
      sandbox.restore();
    });
    it("should boostrap a custom platform", async () => {
      await PlatformBuilder.bootstrap(ServerModule, {
        adapter: {} as any
      });

      expect(PlatformBuilder.build).to.have.been.calledWithExactly(ServerModule, {
        adapter: {}
      });
    });
  });

  describe("static create()", () => {
    beforeEach(() => {
      sandbox.stub(PlatformBuilder, "build");
    });
    afterEach(() => {
      sandbox.restore();
    });
    it("should boostrap a custom platform", () => {
      PlatformBuilder.create(ServerModule, {
        adapter: {} as any
      });

      expect(PlatformBuilder.build).to.have.been.calledWithExactly(ServerModule, {
        adapter: {},
        disableComponentsScan: true,
        httpPort: false,
        httpsPort: false
      });
    });
  });

  describe("bootstrap()", () => {
    it("should bootstrap platform", async () => {
      // WHEN
      const stub = ServerModule.prototype.$beforeRoutesInit;
      const server = await PlatformCustom.bootstrap(ServerModule, {
        httpPort: false,
        httpsPort: false
      });

      // THEN
      await server.listen();
      // THEN
      // @ts-ignore
      expect(server.listenServers).to.have.been.calledWithExactly();
      expect(server.loadStatics).to.have.been.calledWithExactly("$beforeRoutesInit");
      expect(server.loadStatics).to.have.been.calledWithExactly("$afterRoutesInit");
      expect(server.injector.emit).to.have.been.calledWithExactly("$afterInit");
      expect(server.injector.emit).to.have.been.calledWithExactly("$beforeRoutesInit");
      expect(server.injector.emit).to.have.been.calledWithExactly("$afterRoutesInit");
      expect(server.injector.emit).to.have.been.calledWithExactly("$afterListen");
      expect(server.injector.emit).to.have.been.calledWithExactly("$beforeListen");
      expect(server.injector.emit).to.have.been.calledWithExactly("$onServerReady");
      expect(server.injector.emit).to.have.been.calledWithExactly("$onReady");

      // THEN
      expect(server.rootModule).to.be.instanceof(ServerModule);
      expect(stub).to.have.been.calledOnceWithExactly();
      expect(server.name).to.eq("custom");

      await server.stop();
      expect(server.injector.emit).to.have.been.calledWithExactly("$onDestroy");
    });
  });
  describe("callback()", () => {
    it("should return the callback", async () => {
      // WHEN
      const server = await PlatformCustom.bootstrap(ServerModule, {
        httpPort: false,
        httpsPort: false
      });

      expect(server.callback()).to.deep.eq(server.app.raw);

      server.callback({} as any, {} as any);
    });
  });
  describe("useProvider()", () => {
    it("should add provider", async () => {
      // WHEN
      const server = PlatformCustom.create(ServerModule, {
        httpPort: false,
        httpsPort: false
      });

      @Injectable()
      class Token {}

      server.useProvider(Token, {});

      await server.bootstrap();

      expect(server.injector.get(Token)).to.be.instanceof(Token);
    });
  });
  describe("addComponents", () => {
    it("should add components", async () => {
      // GIVEN
      const server = await PlatformCustom.bootstrap(ServerModule, {});

      class MyClass {}

      // WHEN
      server.addComponents(MyClass);

      // THEN
      expect(normalizePath(server.injector.settings.componentsScan)).to.deep.eq(
        normalizePath([
          resolve(join(process.cwd(), "mvc/**/*.ts")),
          resolve(join(process.cwd(), "services/**/*.ts")),
          resolve(join(process.cwd(), "middlewares/**/*.ts")),
          MyClass
        ])
      );
    });
  });
  describe("addControllers", () => {
    it("should add controllers", async () => {
      // GIVEN
      const server = await PlatformCustom.bootstrap(ServerModule, {});

      class MyClass {}

      // WHEN
      server.addControllers("/test", MyClass);

      // THEN
      expect(server.injector.settings.mount["/test"]).to.deep.eq([MyClass]);
    });
  });
  describe("importProviders()", () => {
    it("should import controllers from modules", async () => {
      const server = await PlatformCustom.bootstrap(ServerModule, {});

      expect(server.injector.settings.get("routes")).to.deep.eq([
        {
          route: "/heath",
          token: HealthCtrl
        },
        {
          route: "/rest",
          token: RestCtrl
        }
      ]);
    });
  });
});
