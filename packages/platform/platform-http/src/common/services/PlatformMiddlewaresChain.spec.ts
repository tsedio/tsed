import {Controller, ControllerProvider} from "@tsed/di";
import {Middleware, Use, UseAuth} from "@tsed/platform-middlewares";
import {AcceptMime, All, EndpointMetadata, Get, getOperationsRoutes, Post} from "@tsed/schema";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {MultipartFile} from "../decorators/multer/multipartFile.js";
import {PlatformAcceptMimesMiddleware} from "../middlewares/PlatformAcceptMimesMiddleware.js";
import {PlatformMulterMiddleware} from "../middlewares/PlatformMulterMiddleware.js";
import {PlatformMiddlewaresChain} from "./PlatformMiddlewaresChain.js";

@Middleware()
class MyAuthMiddleware {
  use() {}
}

@Middleware({
  priority: -1
})
class TokenMiddleware {
  use() {}
}

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

  @Post("/file")
  @UseAuth(MyAuthMiddleware, {scope: "admin"})
  @Use(TokenMiddleware)
  @AcceptMime("application/json")
  authEndpoint(@MultipartFile("file") file: MultipartFile) {}
}

function parentControllerBefore() {}

function getFixture() {
  const provider = PlatformTest.injector.getProvider<ControllerProvider>(TestCtrl)!;
  const platformMiddlewaresChain = PlatformTest.get<PlatformMiddlewaresChain>(PlatformMiddlewaresChain);
  const operationRoutes = getOperationsRoutes<EndpointMetadata>(provider.token);
  return {platformMiddlewaresChain, operationRoutes, provider};
}

describe("PlatformMiddlewaresChain", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return the middlewares for a given endpoint (getMethod)", () => {
    const {platformMiddlewaresChain, operationRoutes} = getFixture();
    const parentsMiddlewares = {
      before: [parentControllerBefore]
    };

    const chain = platformMiddlewaresChain.get(parentsMiddlewares as any, operationRoutes[1]);

    expect(chain.before[0]).toEqual(parentControllerBefore);
  });
  it("should return the middlewares for a given endpoint (allMethod)", () => {
    const {platformMiddlewaresChain, operationRoutes} = getFixture();

    const parentsMiddlewares: any = {
      before: [parentControllerBefore]
    };

    const chain = platformMiddlewaresChain.get(parentsMiddlewares, operationRoutes[1]);

    expect(chain.before[0]).toEqual(parentControllerBefore);
  });

  it("should merge middlewares and sort middleware by priority", () => {
    const {platformMiddlewaresChain, operationRoutes} = getFixture();

    const parentsMiddlewares: any = {
      before: [parentControllerBefore, MyAuthMiddleware, TokenMiddleware]
    };

    const chain = platformMiddlewaresChain.get(parentsMiddlewares, operationRoutes[3]);

    expect(chain.before).toEqual([
      PlatformAcceptMimesMiddleware,
      parentControllerBefore,
      MyAuthMiddleware,
      TokenMiddleware,
      PlatformMulterMiddleware
    ]);
  });
});
