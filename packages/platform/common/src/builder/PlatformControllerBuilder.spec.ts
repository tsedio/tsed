import {All, ControllerProvider, Get, Use} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {OperationMethods} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {EndpointMetadata} from "../domain/EndpointMetadata";
import {PlatformAcceptMimesMiddleware} from "../middlewares/PlatformAcceptMimesMiddleware";
import {Platform} from "../services/Platform";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformHandler} from "../services/PlatformHandler";
import {PlatformRouter} from "../services/PlatformRouter";
import {PlatformControllerBuilder} from "./PlatformControllerBuilder";

function getControllerBuilder({propertyKey = "test", withMiddleware = true}: any = {}) {
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

  const use = Sinon.stub();
  const router = {
    get: use,
    use,
    post: use,
    all: use
  };

  // @ts-ignore
  stub(PlatformRouter.createRawRouter).returns(router);

  const injector = new InjectorService();

  injector.addProvider(PlatformRouter, {
    useClass: PlatformRouter
  });
  injector.addProvider(PlatformHandler, {
    useClass: PlatformHandler
  });
  injector.addProvider(PlatformApplication, {
    useClass: PlatformApplication
  });
  injector.addProvider(Platform, {
    useClass: Platform
  });

  const provider = new ControllerProvider(TestCtrl);

  provider.setRouter(PlatformRouter.create(injector, {}));

  if (withMiddleware) {
    provider.middlewares = {
      use: [function controllerUse() {}],
      useAfter: [function controllerAfter() {}],
      useBefore: [function controllerBefore() {}]
    };
  }

  const endpoint = EndpointMetadata.get(TestCtrl, propertyKey);

  if (withMiddleware) {
    endpoint.before([function endpointBefore() {}]);
    endpoint.after([function endpointAfter() {}]);
    endpoint.middlewares = [function endpointUse() {}];
  }

  const controllerBuilder = new PlatformControllerBuilder(provider);

  return {endpoint, router, provider, injector, controllerBuilder, TestCtrl};
}

const sandbox = Sinon.createSandbox();
describe("PlatformControllerBuilder", () => {
  beforeEach(() => {
    // @ts-ignore
    sandbox.stub(PlatformRouter, "createRawRouter");
    // @ts-ignore
    sandbox.stub(PlatformRouter.prototype, "mapHandlers").callsFake((o) => o);
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("should build controller with single endpoint", () => {
    // GIVEN
    const {endpoint, controllerBuilder, provider, router, injector} = getControllerBuilder({propertyKey: "getMethod"});

    endpoint.addOperationPath(OperationMethods.GET, "/", {isFinal: true});

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    expect(result).to.be.instanceof(PlatformRouter);
    expect(router.use).to.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    // ENDPOINT
    expect(router.get).to.have.been.calledWithExactly(
      "/",
      Sinon.match.func,
      PlatformAcceptMimesMiddleware,
      endpoint.beforeMiddlewares[0],
      provider.middlewares.use[0],
      endpoint.middlewares[0],
      endpoint,
      endpoint.afterMiddlewares[0],
      provider.middlewares.useAfter[0]
    );
  });
});
