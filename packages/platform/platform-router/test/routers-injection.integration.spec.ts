import {Controller, ControllerProvider, inject, injector} from "@tsed/di";
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
  const platformRouters = inject(PlatformRouters);
  const platformParams = inject(PlatformParams);
  const appRouter = inject(PlatformRouter);

  platformRouters.hooks.destroy();

  injector().addProvider(CustomStaticsCtrl, {});

  return {appRouter, platformRouters, platformParams};
}

describe("Routers injection", () => {
  it("should load router and inject router to the given controller", () => {
    const {platformRouters} = createAppRouterFixture();

    // prebuild controllers to inject router in controller
    platformRouters.prebuild();

    const router = platformRouters.from(CustomStaticsCtrl);
    const router1 = platformRouters.from(CustomStaticsCtrl);

    const provider = injector().getProvider<ControllerProvider>(CustomStaticsCtrl)!;
    const router2 = injector().get(provider.tokenRouter);
    const controller = inject(CustomStaticsCtrl)!;

    expect(router).toEqual(router1);
    expect(router).toEqual(router2);
    expect(controller.router).toEqual(router2);

    const layers = platformRouters.getLayers(router);

    expect(layers[0].path).toEqual("/");
    expect(layers[0].method).toEqual("statics");
  });
});
