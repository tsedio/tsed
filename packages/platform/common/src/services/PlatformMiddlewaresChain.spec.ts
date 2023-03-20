import {Controller, ControllerProvider} from "@tsed/di";
import {Use} from "@tsed/platform-middlewares";
import {All, EndpointMetadata, Get, getOperationsRoutes} from "@tsed/schema";
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
    const parentsMiddlewares = [function parentControllerBefore() {}];

    const chain = platformMiddlewaresChain.get(parentsMiddlewares, operationRoutes[1]);

    expect(chain[0]).toEqual(parentsMiddlewares[0]);
  });
  it("should return the middlewares for a given endpoint (allMethod)", () => {
    const provider = PlatformTest.injector.getProvider<ControllerProvider>(TestCtrl)!;
    const platformMiddlewaresChain = PlatformTest.get<PlatformMiddlewaresChain>(PlatformMiddlewaresChain);
    const operationRoutes = getOperationsRoutes<EndpointMetadata>(provider.token);
    const parentsMiddlewares = [function parentControllerBefore() {}];
    const chain = platformMiddlewaresChain.get(parentsMiddlewares, operationRoutes[1]);

    expect(chain[0]).toEqual(parentsMiddlewares[0]);
  });
});
