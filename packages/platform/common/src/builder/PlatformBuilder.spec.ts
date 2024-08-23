import {catchAsyncError, Type} from "@tsed/core";
import {Configuration, Controller, Injectable, InjectorService, Module} from "@tsed/di";
import {AfterInit} from "../interfaces/AfterInit.js";
import {AfterListen} from "../interfaces/AfterListen.js";
import {AfterRoutesInit} from "../interfaces/AfterRoutesInit.js";
import {BeforeInit} from "../interfaces/BeforeInit.js";
import {BeforeListen} from "../interfaces/BeforeListen.js";
import {BeforeRoutesInit} from "../interfaces/BeforeRoutesInit.js";
import {OnReady} from "../interfaces/OnReady.js";
import {FakeAdapter} from "../services/FakeAdapter.js";
import {Platform} from "../services/Platform.js";
import {PlatformBuilder} from "./PlatformBuilder.js";

@Controller("/")
class RestCtrl {}

class PlatformCustom extends FakeAdapter {
  static readonly NAME = "custom";
  readonly providers = [
    {
      provide: class Test {}
    }
  ];

  static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.create<any>(module, {
      ...settings,
      adapter: PlatformCustom
    });
  }

  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
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

describe("PlatformBuilder", () => {
  describe("loadStatics()", () => {
    it("should loadStatics", async () => {
      // WHEN
      const platform = await PlatformCustom.bootstrap(ServerModule, {
        httpPort: false,
        httpsPort: false,
        statics: {
          "/": ["/root", {root: "/root2", test: "test", hook: "$beforeRoutesInit"}]
        }
      });

      vi.spyOn(platform.app, "statics").mockReturnValue(undefined as any);

      await platform.loadStatics("$beforeRoutesInit");

      expect(platform.app.statics).toHaveBeenCalledWith("/", {
        hook: "$beforeRoutesInit",
        root: "/root2",
        test: "test"
      });
    });
  });
  describe("loadMiddlewaresFor()", () => {
    it("should load middlewares", async () => {
      const middlewares: any[] = [
        {
          hook: "$beforeRoutesInit",
          use: vi.fn()
        },
        {
          hook: "$afterRoutesInit",
          use: vi.fn()
        },
        vi.fn()
      ];
      // WHEN
      const platform = await PlatformCustom.bootstrap(ServerModule, {
        httpPort: false,
        httpsPort: false,
        middlewares
      });

      vi.spyOn(platform.app, "use").mockReturnValue(undefined as any);

      // @ts-ignore
      platform.loadMiddlewaresFor("$beforeRoutesInit");

      expect(platform.app.use).toHaveBeenCalledWith(middlewares[0].use);
      expect(platform.app.use).toHaveBeenCalledWith(middlewares[2]);
    });
    it("should throw an error when a Ts.ED middleware is added on $afterInit hook", async () => {
      const middlewares: any[] = [
        {
          hook: "$afterInit",
          use: class TestMiddleware {}
        }
      ];
      // WHEN
      const error = await catchAsyncError(() =>
        PlatformCustom.bootstrap(ServerModule, {
          httpPort: false,
          httpsPort: false,
          middlewares
        })
      );

      expect(error?.message).toEqual(
        'Ts.ED Middleware "TestMiddleware" middleware cannot be added on $afterInit hook. Use one of this hooks instead: $beforeRoutesInit, $onRoutesInit, $afterRoutesInit, $beforeListen, $afterListen, $onReady'
      );
    });
    it("should throw an error when a Ts.ED middleware is added on $beforeInit hook", async () => {
      const middlewares: any[] = [
        {
          hook: "$beforeInit",
          use: class TestMiddleware {}
        }
      ];
      // WHEN
      const error = await catchAsyncError(() =>
        PlatformCustom.bootstrap(ServerModule, {
          httpPort: false,
          httpsPort: false,
          middlewares
        })
      );

      expect(error?.message).toEqual(
        'Ts.ED Middleware "TestMiddleware" middleware cannot be added on $beforeInit hook. Use one of this hooks instead: $beforeRoutesInit, $onRoutesInit, $afterRoutesInit, $beforeListen, $afterListen, $onReady'
      );
    });
    it("should throw an error when a Ts.ED middleware is added on $onInit hook", async () => {
      const middlewares: any[] = [
        {
          hook: "$onInit",
          use: class TestMiddleware {}
        }
      ];
      // WHEN
      const error = await catchAsyncError(() =>
        PlatformCustom.bootstrap(ServerModule, {
          httpPort: false,
          httpsPort: false,
          middlewares
        })
      );

      expect(error?.message).toEqual(
        'Ts.ED Middleware "TestMiddleware" middleware cannot be added on $onInit hook. Use one of this hooks instead: $beforeRoutesInit, $onRoutesInit, $afterRoutesInit, $beforeListen, $afterListen, $onReady'
      );
    });
  });
  describe("static boostrap()", () => {
    beforeAll(() => {
      vi.spyOn(ServerModule.prototype, "$beforeRoutesInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$afterRoutesInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$afterInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$afterListen").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$beforeInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$beforeListen").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$onReady").mockReturnValue(undefined);
      vi.spyOn(PlatformBuilder.prototype, "loadStatics");
      // @ts-ignore
      vi.spyOn(PlatformBuilder.prototype, "listenServers");
      vi.spyOn(InjectorService.prototype, "emit").mockResolvedValue(undefined);
      vi.spyOn(Platform.prototype, "addRoutes").mockReturnValue(undefined);
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
      vi.spyOn(ServerModule.prototype, "$beforeRoutesInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$afterRoutesInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$afterInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$afterListen").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$beforeInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$beforeListen").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$onReady").mockReturnValue(undefined);
      vi.spyOn(PlatformBuilder.prototype, "loadStatics");
      // @ts-ignore
      vi.spyOn(PlatformBuilder.prototype, "listenServers");
      vi.spyOn(InjectorService.prototype, "emit").mockResolvedValue(undefined);
      vi.spyOn(Platform.prototype, "addRoutes").mockReturnValue(undefined);
    });
    afterAll(() => {
      vi.resetAllMocks();
    });
    it("should boostrap a custom platform", () => {
      const platform = PlatformBuilder.create(ServerModule, {
        adapter: FakeAdapter
      });

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
  describe("adapter()", () => {
    beforeAll(() => {
      vi.spyOn(ServerModule.prototype, "$beforeRoutesInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$afterRoutesInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$afterInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$afterListen").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$beforeInit").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$beforeListen").mockReturnValue(undefined);
      vi.spyOn(ServerModule.prototype, "$onReady").mockReturnValue(undefined);
      vi.spyOn(PlatformBuilder.prototype, "loadStatics").mockResolvedValue(undefined as never);
      // @ts-ignore
      vi.spyOn(PlatformBuilder.prototype, "listenServers");
      vi.spyOn(InjectorService.prototype, "emit").mockResolvedValue(undefined);
      vi.spyOn(Platform.prototype, "addRoutes").mockReturnValue(undefined);
    });
    it("should boostrap a custom platform", async () => {
      const platformBuilder = await PlatformBuilder.bootstrap(ServerModule, {
        adapter: FakeAdapter
      });

      expect(platformBuilder.callback()).toBeInstanceOf(Function);

      expect(platformBuilder.adapter).toBeInstanceOf(FakeAdapter);
    });

    it("should listen a custom platform", async () => {
      const platform = await PlatformBuilder.create(ServerModule, {
        adapter: FakeAdapter
      });

      await platform.listen();
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
      expect(server.injector.settings.get("imports")).toEqual([HealthModule, MyClass]);
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
