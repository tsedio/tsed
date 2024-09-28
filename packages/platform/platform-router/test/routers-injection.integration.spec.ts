import {Controller, ControllerProvider, InjectorService} from "@tsed/di";
import {PlatformParams} from "@tsed/platform-params";

import {PlatformRouter} from "../src/domain/PlatformRouter.js";
import {PlatformRouters} from "../src/domain/PlatformRouters.js";

@Controller("/statics")
class CustomStaticsCtrl {
  constructor(public router: PlatformRouter) {
    router.statics("/", {
      root: "/assets"
    });
  }
}

function createAppRouterFixture() {
  const injector = new InjectorService();
  const platformRouters = injector.invoke<PlatformRouters>(PlatformRouters);
  const platformParams = injector.invoke<PlatformParams>(PlatformParams);
  const appRouter = injector.invoke<PlatformRouter>(PlatformRouter);

  injector.addProvider(CustomStaticsCtrl, {});

  return {injector, appRouter, platformRouters, platformParams};
}

describe("Routers injection", () => {
  it("should load router and inject router to the given controller", () => {
    const {injector, platformRouters} = createAppRouterFixture();

    // prebuild controllers to inject router in controller
    platformRouters.prebuild();

    const router = platformRouters.from(CustomStaticsCtrl);
    const router1 = platformRouters.from(CustomStaticsCtrl);

    const provider = injector.getProvider<ControllerProvider>(CustomStaticsCtrl)!;
    const router2 = injector.get(provider.tokenRouter);
    const controller = injector.invoke<CustomStaticsCtrl>(CustomStaticsCtrl)!;

    expect(router).toEqual(router1);
    expect(router).toEqual(router2);
    expect(controller.router).toEqual(router2);

    const layers = platformRouters.getLayers(router);

    expect(layers[0].path).toEqual("/");
    expect(layers[0].method).toEqual("statics");
  });
});
