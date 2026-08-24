import {Configuration, Controller, Injectable, Module, configuration, destroyInjector, injector} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {AfterInit} from "../interfaces/AfterInit.js";
import {AfterListen} from "../interfaces/AfterListen.js";
import {AfterRoutesInit} from "../interfaces/AfterRoutesInit.js";
import {BeforeInit} from "../interfaces/BeforeInit.js";
import {BeforeListen} from "../interfaces/BeforeListen.js";
import {BeforeRoutesInit} from "../interfaces/BeforeRoutesInit.js";
import {FakeAdapter} from "../../testing/index.js";
import {OnReady} from "../interfaces/OnReady.js";
import {Platform} from "../services/Platform.js";
import {PlatformBuilder} from "./PlatformBuilder.js";
import {PlatformCustom} from "./__fixtures__/PlatformCustom.js";

vi.mock("@tsed/hooks", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tsed/hooks")>();

  return {
    ...mod,
    $asyncEmit: vi.fn()
  };
});

@Controller("/")
class RestCtrl {}

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
        }
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
    });
  });
  describe("boostrap", () => {
    beforeEach(() => {
      destroyInjector();
      const inj = injector();
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
      vi.spyOn(Platform.prototype, "addRoutes").mockReturnValue(undefined);
    });

    describe("static boostrap()", () => {
      it("should boostrap a custom platform", async () => {
        const result = await PlatformBuilder.bootstrap({
          rootModule: ServerModule,
          adapter: FakeAdapter
        });

        expect(result).toBeInstanceOf(PlatformBuilder);
      });
    });
    describe("static create()", () => {
      it("should boostrap a custom platform", () => {
        PlatformBuilder.create({
          rootModule: ServerModule,
          adapter: FakeAdapter
        });

        expect(configuration().get("httpPort")).toEqual(false);
        expect(configuration().get("httpsPort")).toEqual(false);
      });
    });
    describe("static options()", () => {
      it("should preserve a root module without settings", () => {
        expect(PlatformBuilder.options(FakeAdapter, ServerModule)).toEqual({
          rootModule: ServerModule,
          adapter: FakeAdapter
        });
      });

      it("should preserve the root module and settings", () => {
        expect(PlatformBuilder.options(FakeAdapter, ServerModule, {httpPort: 8080})).toEqual({
          rootModule: ServerModule,
          httpPort: 8080,
          adapter: FakeAdapter
        });
      });

      it("should accept settings without a root module", () => {
        expect(PlatformBuilder.options(FakeAdapter, {httpPort: 8080})).toEqual({
          rootModule: undefined,
          httpPort: 8080,
          adapter: FakeAdapter
        });
      });
    });
    describe("bootstrap()", () => {
      it("should bootstrap platform", async () => {
        // WHEN
        vi.mocked($asyncEmit).mockResolvedValue(undefined);

        const stub = ServerModule.prototype.$beforeRoutesInit;
        const server = await PlatformCustom.bootstrap(ServerModule, {
          httpPort: false,
          httpsPort: false
        });
        // THEN
        await server.listen();

        // THEN
        // @ts-ignore
        expect(server.listenServers).toHaveBeenCalledWith();
        expect(server.loadStatics).toHaveBeenCalledWith("$beforeRoutesInit");
        expect(server.loadStatics).toHaveBeenCalledWith("$afterRoutesInit");
        expect($asyncEmit).toHaveBeenCalledWith("$afterInit", []);
        expect($asyncEmit).toHaveBeenCalledWith("$beforeRoutesInit", []);
        expect($asyncEmit).toHaveBeenCalledWith("$afterRoutesInit", []);
        expect($asyncEmit).toHaveBeenCalledWith("$afterListen", []);
        expect($asyncEmit).toHaveBeenCalledWith("$beforeListen", []);
        expect($asyncEmit).toHaveBeenCalledWith("$onReady", []);

        // THEN
        expect(server.rootModule).toBeInstanceOf(ServerModule);
        expect(stub).toHaveBeenCalled();
        expect(server.name).toEqual("custom");

        await server.stop();
        expect($asyncEmit).toHaveBeenCalledWith("$onDestroy");
      });
    });
    describe("adapter()", () => {
      it("should boostrap a custom platform", async () => {
        const platformBuilder = await PlatformBuilder.bootstrap({
          rootModule: ServerModule,
          adapter: FakeAdapter
        });

        expect(platformBuilder.callback()).toBeInstanceOf(Function);

        expect(platformBuilder.adapter).toBeInstanceOf(FakeAdapter);
      });

      it("should listen a custom platform", async () => {
        const platform = await PlatformBuilder.create({
          rootModule: ServerModule,
          adapter: FakeAdapter
        });

        await platform.listen();
      });
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
  describe("addControllers", () => {
    beforeEach(() => destroyInjector());
    it("should add controllers", async () => {
      // GIVEN
      const server = await PlatformCustom.bootstrap(ServerModule, {});

      class MyClass {}

      // WHEN
      server.addControllers("/test", MyClass);

      // THEN
      expect(server.injector.settings.get("routes")).toEqual([
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
