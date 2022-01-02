import {expect} from "chai";
import {ControllerProvider, EndpointMetadata, PlatformAcceptMimesMiddleware} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Use} from "@tsed/platform-middlewares";
import {All, Get, getOperationsRoutes} from "@tsed/schema";
import {PlatformTest} from "./PlatformTest";
import {PlatformMiddlewaresChain} from "./PlatformMiddlewaresChain";
import Sinon from "sinon";

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

  it("should return the middlewares for a given endpoint", () => {
    const provider = PlatformTest.injector.getProvider<ControllerProvider>(TestCtrl)!;
    const platformMiddlewaresChain = PlatformTest.get<PlatformMiddlewaresChain>(PlatformMiddlewaresChain);
    const operationRoutes = getOperationsRoutes<EndpointMetadata>(provider.token);
    const endpoint = EndpointMetadata.get(TestCtrl, "getMethod");

    provider.middlewares = {
      use: [function controllerUse() {}],
      useAfter: [function controllerAfter() {}],
      useBefore: [function controllerBefore() {}]
    };

    endpoint.before([function endpointBefore() {}]);
    endpoint.after([function endpointAfter() {}]);
    endpoint.middlewares = [function endpointUse() {}];

    const chain = platformMiddlewaresChain.get(provider, operationRoutes[1]);

    expect(chain[0].type).to.eq("context");
    expect(chain[1]).to.eq(endpoint.beforeMiddlewares[0]);
    expect(chain[2]).to.eq(provider.middlewares.use[0]);
    expect(chain[3]).to.eq(endpoint.middlewares[0]);
    expect(chain[4]).to.eq(endpoint);
    expect(chain[5]).to.eq(endpoint.afterMiddlewares[0]);
    expect(chain[6]).to.eq(provider.middlewares.useAfter[0]);
  });
});
