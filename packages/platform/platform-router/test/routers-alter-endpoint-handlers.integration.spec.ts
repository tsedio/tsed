import {PlatformTest} from "@tsed/common";
import {Controller, DIContext, InjectorService} from "@tsed/di";
import {UseBefore} from "@tsed/platform-middlewares";
import {Context, PlatformParams} from "@tsed/platform-params";
import {EndpointMetadata, Get, JsonOperationRoute} from "@tsed/schema";
import {PlatformRouter} from "../src/domain/PlatformRouter";
import {PlatformRouters} from "../src/domain/PlatformRouters";
import {useContextHandler} from "../src/index";

@Controller("/controller")
@UseBefore(function useBefore() {})
class MyController {
  @Get("/")
  get(@Context() $ctx: Context) {
    return $ctx;
  }
}

function createAppRouterFixture() {
  const injector = new InjectorService();
  const platformRouters = injector.invoke<PlatformRouters>(PlatformRouters);
  const platformParams = injector.invoke<PlatformParams>(PlatformParams);
  const appRouter = injector.invoke<PlatformRouter>(PlatformRouter);

  injector.addProvider(MyController, {});

  return {injector, appRouter, platformRouters, platformParams};
}

describe("routers with alter handlers", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should declare router - appRouter", async () => {
    const {appRouter, platformRouters} = createAppRouterFixture();

    platformRouters.hooks.on("alterEndpointHandlers", (allMiddlewares: any[], operationRoute: JsonOperationRoute) => {
      const {endpoint} = operationRoute;

      return [
        useContextHandler(($ctx: DIContext) => {
          $ctx.set(EndpointMetadata, endpoint);
        }),
        ...allMiddlewares
      ];
    });

    const router = platformRouters.from(MyController);

    appRouter.use("/rest", router);

    const layers = platformRouters.getLayers(appRouter);

    expect(layers.length).toEqual(1);

    const $ctx: any = {};
    await (layers[0].getArgs() as any)[1]({$ctx});

    expect($ctx.endpoint).toBeDefined();
  });
});
