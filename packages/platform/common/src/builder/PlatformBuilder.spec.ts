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
  OnReady
} from "@tsed/common";
import {Type} from "@tsed/core";
import {Configuration} from "@tsed/di";
import {FakeAdapter} from "../services/FakeAdapter";
import {Platform} from "../services/Platform";
import {PlatformBuilder} from "./PlatformBuilder";

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

  describe("static boostrap()", () => {
    beforeAll(() => {
      jest.spyOn(ServerModule.prototype, "$beforeRoutesInit").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$afterRoutesInit").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$afterInit").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$afterListen").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$beforeInit").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$beforeListen").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$onReady").mockReturnValue(undefined);
      jest.spyOn(PlatformBuilder.prototype, "loadStatics").mockResolvedValue(undefined);
      // @ts-ignore
      jest.spyOn(PlatformBuilder.prototype, "listenServers");
      jest.spyOn(InjectorService.prototype, "emit").mockResolvedValue(undefined);
      jest.spyOn(Platform.prototype, "addRoutes").mockReturnValue(undefined);
    });
    it("should boostrap a custom platform", async () => {
      const result = await PlatformBuilder.bootstrap(ServerModule, {
        adapter: FakeAdapter
      });

      expect(result).toBeInstanceOf(PlatformBuilder);
    });
  });
  describe("static create()", () => {
    beforeEach(() => {
      jest.spyOn(ServerModule.prototype, "$beforeRoutesInit").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$afterRoutesInit").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$afterInit").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$afterListen").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$beforeInit").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$beforeListen").mockReturnValue(undefined);
      jest.spyOn(ServerModule.prototype, "$onReady").mockReturnValue(undefined);
      jest.spyOn(PlatformBuilder.prototype, "loadStatics").mockResolvedValue(undefined);
      // @ts-ignore
      jest.spyOn(PlatformBuilder.prototype, "listenServers");
      jest.spyOn(InjectorService.prototype, "emit").mockResolvedValue(undefined);
      jest.spyOn(Platform.prototype, "addRoutes").mockReturnValue(undefined);
    });
    afterAll(() => jest.resetAllMocks());
    it("should boostrap a custom platform", () => {
      const platform = PlatformBuilder.create(ServerModule, {
        adapter: FakeAdapter
      });

      expect(platform.settings.get("disableComponentsScan")).toEqual(true);
      expect(platform.settings.get("httpPort")).toEqual(false);
      expect(platform.settings.get("httpsPort")).toEqual(false);
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
      expect(server.listenServers).toBeCalledWith();
      expect(server.loadStatics).toBeCalledWith("$beforeRoutesInit");
      expect(server.loadStatics).toBeCalledWith("$afterRoutesInit");
      expect(server.injector.emit).toBeCalledWith("$afterInit");
      expect(server.injector.emit).toBeCalledWith("$beforeRoutesInit");
      expect(server.injector.emit).toBeCalledWith("$afterRoutesInit");
      expect(server.injector.emit).toBeCalledWith("$afterListen");
      expect(server.injector.emit).toBeCalledWith("$beforeListen");
      expect(server.injector.emit).toBeCalledWith("$onServerReady");
      expect(server.injector.emit).toBeCalledWith("$onReady");

      // THEN
      expect(server.rootModule).toBeInstanceOf(ServerModule);
      expect(stub).toHaveBeenCalled();
      expect(server.name).toEqual("custom");

      await server.stop();
      expect(server.injector.emit).toBeCalledWith("$onDestroy");
    });
  });
  describe("callback()", () => {
    it("should return the callback", async () => {
      // WHEN
      const server = await PlatformCustom.bootstrap(ServerModule, {
        httpPort: false,
        httpsPort: false
      });

      expect(server.callback()).toBeInstanceOf(Function);

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

      expect(server.injector.get(Token)).toBeInstanceOf(Token);
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
      expect(normalizePath(server.injector.settings.get("componentsScan"))).toEqual(expect.arrayContaining([MyClass]));
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
      expect(server.injector.settings.routes).toEqual([
        {
          route: "/heath",
          token: HealthCtrl
        },
        {
          route: "/rest",
          token: RestCtrl
        },
        {
          route: "/test",
          token: MyClass
        }
      ]);
    });
  });
});
