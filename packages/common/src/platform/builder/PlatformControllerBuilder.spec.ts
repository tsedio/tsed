import {InjectorService} from "@tsed/di";
import {expect} from "chai";
import * as Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {EndpointMetadata} from "../../mvc/models/EndpointMetadata";
import {ControllerProvider} from "../domain/ControllerProvider";
import {PlatformHeadersMiddleware} from "../middlewares/PlatformHeadersMiddleware";
import {SendResponseMiddleware} from "../middlewares/SendResponseMiddleware";
import {Platform} from "../services/Platform";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformDriver} from "../services/PlatformDriver";
import {PlatformHandler} from "../services/PlatformHandler";
import {PlatformRouter} from "../services/PlatformRouter";
import {PlatformControllerBuilder} from "./PlatformControllerBuilder";

function getControllerBuilder({propertyKey = "test", withMiddleware = true}: any = {}) {
  class TestCtrl {}

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

  if (withMiddleware) {
    provider.middlewares = {
      use: [function controllerUse() {}],
      useAfter: [function controllerAfter() {}],
      useBefore: [function controllerBefore() {}]
    };
  }

  const endpoint = new EndpointMetadata({target: TestCtrl, propertyKey});

  if (withMiddleware) {
    endpoint.before([function endpointBefore() {}]);
    endpoint.after([function endpointAfter() {}]);
    endpoint.middlewares = [function endpointUse() {}];
  }

  // @ts-ignore
  EndpointMetadata.getEndpoints.returns([endpoint]);

  const controllerBuilder = new PlatformControllerBuilder(provider);

  return {endpoint, router, provider, injector, controllerBuilder, TestCtrl};
}

const sandbox = Sinon.createSandbox();
describe("ControllerBuilder", () => {
  beforeEach(() => {
    // @ts-ignore
    sandbox.stub(PlatformRouter, "createRawRouter");
    sandbox.stub(PlatformDriver.prototype, "mapHandlers").callsFake((o) => o);
    sandbox.stub(EndpointMetadata, "getEndpoints");
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("should build controller with single endpoint", () => {
    // GIVEN
    const {endpoint, controllerBuilder, provider, router, injector} = getControllerBuilder();

    endpoint.pathsMethods.push({
      path: "/",
      method: "get",
      isFinal: true
    });

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    expect(result).to.be.instanceof(PlatformRouter);
    // expect(router.use.callCount).to.deep.eq(3);
    expect(router.use).to.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    expect(router.use).to.have.been.calledWithExactly(provider.middlewares.useAfter[0]); // controller

    // ENDPOINT
    expect(router.get).to.have.been.calledWithExactly(
      "/",
      Sinon.match.func,
      provider.middlewares.use[0],
      endpoint.beforeMiddlewares[0],
      endpoint.middlewares[0],
      endpoint,
      PlatformHeadersMiddleware,
      endpoint.afterMiddlewares[0],
      SendResponseMiddleware
    );
  });

  it("should build controller with only route configured", () => {
    // GIVEN
    const {endpoint, controllerBuilder, provider, router, injector} = getControllerBuilder();

    endpoint.pathsMethods.push({
      path: "/"
    });

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    expect(result).to.be.instanceof(PlatformRouter);
    expect(router.use.getCall(0)).to.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    // ENDPOINT
    expect(router.use.getCall(1)).to.have.been.calledWithExactly(
      "/",
      Sinon.match.func,
      provider.middlewares.use[0],
      endpoint.beforeMiddlewares[0],
      endpoint.middlewares[0],
      endpoint,
      Sinon.match.func,
      endpoint.afterMiddlewares[0]
    );

    expect(router.use.getCall(2)).to.have.been.calledWithExactly(provider.middlewares.useAfter[0]); // controller
  });

  it("should build controller without route and method", () => {
    // GIVEN
    const {endpoint, controllerBuilder, provider, router, injector} = getControllerBuilder();

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    expect(result).to.be.instanceof(PlatformRouter);
    expect(router.use.getCall(0)).to.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    // ENDPOINT
    expect(router.use.getCall(1)).to.have.been.calledWithExactly(
      Sinon.match.func,
      provider.middlewares.use[0],
      endpoint.beforeMiddlewares[0],
      endpoint.middlewares[0],
      endpoint,
      Sinon.match.func,
      endpoint.afterMiddlewares[0]
    );

    expect(router.use.getCall(2)).to.have.been.calledWithExactly(provider.middlewares.useAfter[0]); // controller
  });

  it("should build controller with a all endpoint and get endpoint", () => {
    // GIVEN
    const {endpoint, controllerBuilder, router, injector, TestCtrl} = getControllerBuilder({
      propertyKey: "getMethod",
      withMiddleware: false
    });

    endpoint.pathsMethods.push({
      method: "get",
      path: "/",
      isFinal: true
    });

    const endpointAll = new EndpointMetadata({target: TestCtrl, propertyKey: "allMethod"});
    endpointAll.pathsMethods.push({
      method: "all",
      path: "/",
      isFinal: true
    });

    // @ts-ignore
    EndpointMetadata.getEndpoints.returns([endpointAll, endpoint]);

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    expect(result).to.be.instanceof(PlatformRouter);
    // ENDPOINT
    expect(router.use.getCall(0)).to.have.been.calledWithExactly("/", Sinon.match.func, endpointAll, PlatformHeadersMiddleware);
    expect(router.use.getCall(1)).to.have.been.calledWithExactly("/", Sinon.match.func, endpoint, Sinon.match.func, SendResponseMiddleware);
  });
});
