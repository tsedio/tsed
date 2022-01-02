import {All, buildRouter, ControllerProvider, Get, Use} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {EndpointMetadata, OperationMethods} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";
import {Platform} from "../services/Platform";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformHandler} from "../services/PlatformHandler";
import {PlatformRouter} from "../services/PlatformRouter";

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

  provider.middlewares = {
    use: [function controllerUse() {}],
    useAfter: [function controllerAfter() {}],
    useBefore: [function controllerBefore() {}]
  };

  const endpoint = EndpointMetadata.get(TestCtrl, propertyKey);

  endpoint.before([function endpointBefore() {}]);
  endpoint.after([function endpointAfter() {}]);
  endpoint.middlewares = [function endpointUse() {}];

  return {endpoint, router, provider, injector, TestCtrl};
}

const sandbox = Sinon.createSandbox();
describe("buildRouter()", () => {
  beforeEach(() => {
    // @ts-ignore
    sandbox.stub(PlatformRouter, "create").callsFake(() => ({
      $class: "PlatformRouter",
      addRoute: Sinon.stub(),
      get: Sinon.stub(),
      use: Sinon.stub()
    }));
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("should build controller with single endpoint", () => {
    // GIVEN
    const {endpoint, provider, injector} = getControllerBuilder({propertyKey: "getMethod"});

    endpoint.operation.addOperationPath(OperationMethods.GET, "/", {isFinal: true});

    // WHEN
    const result: any = buildRouter(injector, provider);

    // THEN
    expect(result.$class).to.eq("PlatformRouter");

    // ENDPOINT
    expect(result.addRoute).to.have.been.callCount(3);
  });
});
