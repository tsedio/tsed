import {ControllerProvider, EndpointMetadata} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Use} from "@tsed/platform-middlewares";
import {All, Get, getOperationsRoutes} from "@tsed/schema";
import {PlatformMiddlewaresChain} from "./PlatformMiddlewaresChain";
import {PlatformTest} from "./PlatformTest";

@Controller("/")
class TestCtrl {
  @All("/")
  allMethod() {}

  @Get("/")
  getMethod() {}

  @Use("/")
  use() {}

  @Use()
  use2() {}
}

describe("PlatformMiddlewaresChain", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return the middlewares for a given endpoint (getMethod)", () => {
    const provider = PlatformTest.injector.getProvider<ControllerProvider>(TestCtrl)!;
    const platformMiddlewaresChain = PlatformTest.get<PlatformMiddlewaresChain>(PlatformMiddlewaresChain);
    const operationRoutes = getOperationsRoutes<EndpointMetadata>(provider.token);
    const endpoint = EndpointMetadata.get(TestCtrl, "getMethod");
    const parentsMiddlewares = [function parentControllerBefore() {}];

    provider.middlewares = {
      use: [function controllerUse() {}],
      useAfter: [function controllerAfter() {}],
      useBefore: [function controllerBefore() {}]
    };

    endpoint.before([function endpointBefore() {}]);
    endpoint.after([function endpointAfter() {}]);
    endpoint.middlewares = [function endpointUse() {}];

    const chain = platformMiddlewaresChain.get(provider, operationRoutes[1], parentsMiddlewares);

    expect(chain[0].type).toEqual("context");
    expect(chain[1]).toEqual(parentsMiddlewares[0]);
    expect(chain[2]).toEqual(provider.middlewares.useBefore[0]);
    expect(chain[3]).toEqual(endpoint.beforeMiddlewares[0]);
    expect(chain[4]).toEqual(provider.middlewares.use[0]);
    expect(chain[5]).toEqual(endpoint.middlewares[0]);
    expect(chain[6]).toEqual(endpoint);
    expect(chain[7]).toEqual(endpoint.afterMiddlewares[0]);
    expect(chain[8]).toEqual(provider.middlewares.useAfter[0]);
  });
  it("should return the middlewares for a given endpoint (allMethod)", () => {
    const provider = PlatformTest.injector.getProvider<ControllerProvider>(TestCtrl)!;
    const platformMiddlewaresChain = PlatformTest.get<PlatformMiddlewaresChain>(PlatformMiddlewaresChain);
    const operationRoutes = getOperationsRoutes<EndpointMetadata>(provider.token);
    const endpoint = EndpointMetadata.get(TestCtrl, "allMethod");
    const parentsMiddlewares = [function parentControllerBefore() {}];

    provider.middlewares = {
      use: [function controllerUse() {}],
      useAfter: [function controllerAfter() {}],
      useBefore: [function controllerBefore() {}]
    };

    endpoint.before([function endpointBefore() {}]);
    endpoint.after([function endpointAfter() {}]);
    endpoint.middlewares = [function endpointUse() {}];

    const chain = platformMiddlewaresChain.get(provider, operationRoutes[1], parentsMiddlewares);

    expect(chain[0].type).toEqual("context");
    expect(chain[1]).toEqual(parentsMiddlewares[0]);
    expect(chain[2].name).toEqual("controllerBefore");
  });
});
