import {catchError} from "@tsed/core";
import {Controller, inject, injector} from "@tsed/di";
import {PlatformContext} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {UseBefore} from "@tsed/platform-middlewares";
import {Context, PlatformParams} from "@tsed/platform-params";
import {Delete, Get, Head, Options, Patch, Post, Publish, Put, Subscribe} from "@tsed/schema";

import {PlatformRouter} from "../src/domain/PlatformRouter.js";
import {AlterEndpointHandlersArg, PlatformRouters} from "../src/domain/PlatformRouters.js";
import {PlatformHandlerMetadata, useResponseHandler} from "../src/index.js";

@Controller("/nested")
class NestedController {
  @Get("/")
  get() {}

  @Post("/")
  post() {}

  @Put("/:id")
  put() {}

  @Delete("/:id")
  delete() {}

  @Head("/:id")
  head() {}

  @Options("/:id")
  option() {}

  @Patch("/:id")
  patch() {}
}

@Controller({path: "/controller", children: [NestedController]})
@UseBefore(function useBefore() {})
class MyController {
  @Get("/")
  @Publish("get.event")
  get(@Context() $ctx: Context) {
    return $ctx;
  }

  @Post("/")
  @Subscribe("update.event")
  post() {}

  @Put("/:id")
  put() {}

  @Delete("/:id")
  delete() {}

  @Head("/:id")
  head() {}

  @Options("/:id")
  option() {}

  @Patch("/:id")
  patch() {}
}

function createAppRouterFixture() {
  const platformRouters = inject(PlatformRouters);
  const platformParams = inject(PlatformParams);
  const appRouter = inject(PlatformRouter);

  platformRouters.hooks.destroy();

  injector().addProvider(NestedController, {});

  platformRouters.hooks.on("alterEndpointHandlers", (handlers: AlterEndpointHandlersArg) => {
    handlers.after.push(useResponseHandler(() => "hello"));
    return handlers;
  });

  platformRouters.hooks.on("alterHandler", (handlerMetadata: PlatformHandlerMetadata) => {
    if (handlerMetadata.isInjectable()) {
      return platformParams.compileHandler(handlerMetadata);
    }

    return handlerMetadata.handler;
  });

  return {appRouter, platformRouters, platformParams};
}

describe("routers integration", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("getLayers()", () => {
    it("should declare router", () => {
      const {platformRouters} = createAppRouterFixture();
      injector().addProvider(MyController, {});

      const hookStub = vi.fn().mockImplementation((o) => o);

      platformRouters.hooks.on("alterEndpointHandlers", hookStub);

      const router = platformRouters.from(MyController);

      expect(hookStub).toHaveBeenCalled();
      expect(router.inspect()).toMatchSnapshot();
    });
    it("should declare router - appRouter", async () => {
      const {appRouter, platformRouters} = createAppRouterFixture();
      injector().addProvider(MyController, {});

      const router = platformRouters.from(MyController);

      appRouter.use("/rest", router);

      // prebuild controllers
      platformRouters.prebuild();

      // returns layers
      const layers = platformRouters.getLayers(appRouter);

      expect(layers.length).toEqual(14);
      expect(layers.map((l) => l.inspect())).toMatchSnapshot();
      expect(layers.find((layer) => layer.method == "use")).toEqual(undefined);

      const args = layers[0].getArgs();
      expect(layers[0].isProvider()).toEqual(true);
      expect(args[0]).toEqual("/rest/controller");
      expect(layers[0].getArgs().length).toEqual(5);

      const $ctx = PlatformTest.createRequestContext();
      const result = await (args[3] as any)!({$ctx});

      expect(result).toBeInstanceOf(PlatformContext);
    });
    it("should throw an error when the controller isn't found", () => {
      const {platformRouters} = createAppRouterFixture();

      const error: any = catchError(() => platformRouters.from(class Test {}));

      expect(error?.message).toEqual("Token not found in the provider registry");
    });
  });

  describe("use()", () => {
    it("should call method", () => {
      injector().addProvider(NestedController, {});

      const router = new PlatformRouter();

      router.use("/hello", function h() {});

      expect(router.inspect()).toEqual([
        {
          basePath: "/hello",
          handlers: ["h"],
          method: "use",
          opts: {},
          path: "/hello"
        }
      ]);
    });
  });
  describe("get()", () => {
    it("should call method", () => {
      const {appRouter} = createAppRouterFixture();

      appRouter.get("/hello", function h() {});

      expect(appRouter.inspect()).toEqual([
        {
          basePath: "",
          handlers: ["h"],
          method: "get",
          opts: {},
          path: "/hello"
        }
      ]);
    });
  });
  describe("post()", () => {
    it("should call method", () => {
      const {appRouter} = createAppRouterFixture();

      appRouter.post("/hello", function h() {});

      expect(appRouter.inspect()).toEqual([
        {
          basePath: "",
          handlers: ["h"],
          method: "post",
          opts: {},
          path: "/hello"
        }
      ]);
    });
  });
  describe("put()", () => {
    it("should call method", () => {
      const {appRouter} = createAppRouterFixture();

      appRouter.put("/hello", function h() {});

      expect(appRouter.inspect()).toEqual([
        {
          basePath: "",
          handlers: ["h"],
          method: "put",
          opts: {},
          path: "/hello"
        }
      ]);
    });
  });
  describe("patch()", () => {
    it("should call method", () => {
      const {appRouter} = createAppRouterFixture();

      appRouter.patch("/hello", function h() {});

      expect(appRouter.inspect()).toEqual([
        {
          basePath: "",
          handlers: ["h"],
          method: "patch",
          opts: {},
          path: "/hello"
        }
      ]);
    });
  });
  describe("head()", () => {
    it("should call method", () => {
      const {appRouter} = createAppRouterFixture();

      appRouter.head("/hello", function h() {});

      expect(appRouter.inspect()).toEqual([
        {
          basePath: "",
          handlers: ["h"],
          method: "head",
          opts: {},
          path: "/hello"
        }
      ]);
    });
  });
  describe("delete()", () => {
    it("should call method", () => {
      const {appRouter} = createAppRouterFixture();

      appRouter.delete("/hello", function h() {});

      expect(appRouter.inspect()).toEqual([
        {
          basePath: "",
          handlers: ["h"],
          method: "delete",
          opts: {},
          path: "/hello"
        }
      ]);
    });
  });
  describe("option()", () => {
    it("should call method", () => {
      const {appRouter} = createAppRouterFixture();

      appRouter.options("/hello", function h() {});

      expect(appRouter.inspect()).toEqual([
        {
          basePath: "",
          handlers: ["h"],
          method: "options",
          opts: {},
          path: "/hello"
        }
      ]);
    });
  });
  describe("all()", () => {
    it("should call method", () => {
      const {appRouter} = createAppRouterFixture();

      appRouter.all("/hello", function h() {});

      expect(appRouter.inspect()).toEqual([
        {
          basePath: "",
          handlers: ["h"],
          method: "all",
          opts: {},
          path: "/hello"
        }
      ]);
    });
  });
  describe("statics()", () => {
    it("should call method", () => {
      const {appRouter} = createAppRouterFixture();

      appRouter.statics("/hello", {root: "root"});

      expect(appRouter.inspect()).toEqual([
        {
          basePath: "",
          handlers: [],
          method: "statics",
          opts: {
            root: "root"
          },
          path: "/hello"
        }
      ]);
    });
  });
});
