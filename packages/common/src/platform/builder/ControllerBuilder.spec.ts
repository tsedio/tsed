import {
  ControllerProvider,
  EndpointMetadata,
  EndpointRegistry,
  PlatformDriver,
  PlatformRouter,
  SendResponseMiddleware,
  statusAndHeadersMiddleware
} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import * as Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {ControllerBuilder} from "./ControllerBuilder";

function getControllerBuilder({propertyKey = "test", withMiddleware = true}: any = {}) {
  class TestCtrl {}
  const use = Sinon.stub();
  const router = {
    get: use,
    use,
    post: use,
    all: use
  };

  stub(Express.Router).returns(router);

  const injector = new InjectorService();
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
  EndpointRegistry.getEndpoints.returns([endpoint]);

  const controllerBuilder = new ControllerBuilder(provider);

  return {endpoint, router, provider, injector, controllerBuilder, TestCtrl};
}

const sandbox = Sinon.createSandbox();
describe("ControllerBuilder", () => {
  beforeEach(() => {
    sandbox.stub(Express, "Router");
    sandbox.stub(PlatformDriver.prototype, "mapHandlers").callsFake(o => o);
    sandbox.stub(EndpointRegistry, "getEndpoints");
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
    result.should.be.instanceof(PlatformRouter);
    // router.use.callCount.should.deep.eq(3);
    router.use.should.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    router.use.should.have.been.calledWithExactly(provider.middlewares.useAfter[0]); // controller

    // ENDPOINT
    router.get.should.have.been.calledWithExactly(
      "/",
      Sinon.match.func,
      provider.middlewares.use[0],
      endpoint.beforeMiddlewares[0],
      endpoint.middlewares[0],
      endpoint,
      statusAndHeadersMiddleware,
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
    result.should.be.instanceof(PlatformRouter);
    router.use.getCall(0).should.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    // ENDPOINT
    router.use
      .getCall(1)
      .should.have.been.calledWithExactly(
        "/",
        Sinon.match.func,
        provider.middlewares.use[0],
        endpoint.beforeMiddlewares[0],
        endpoint.middlewares[0],
        endpoint,
        Sinon.match.func,
        endpoint.afterMiddlewares[0]
      );

    router.use.getCall(2).should.have.been.calledWithExactly(provider.middlewares.useAfter[0]); // controller
  });

  it("should build controller without route and method", () => {
    // GIVEN
    const {endpoint, controllerBuilder, provider, router, injector} = getControllerBuilder();

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    result.should.be.instanceof(PlatformRouter);
    router.use.getCall(0).should.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    // ENDPOINT
    router.use
      .getCall(1)
      .should.have.been.calledWithExactly(
        Sinon.match.func,
        provider.middlewares.use[0],
        endpoint.beforeMiddlewares[0],
        endpoint.middlewares[0],
        endpoint,
        Sinon.match.func,
        endpoint.afterMiddlewares[0]
      );

    router.use.getCall(2).should.have.been.calledWithExactly(provider.middlewares.useAfter[0]); // controller
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
    EndpointRegistry.getEndpoints.returns([endpointAll, endpoint]);

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    result.should.be.instanceof(PlatformRouter);
    // ENDPOINT
    router.use.getCall(0).should.have.been.calledWithExactly("/", Sinon.match.func, endpointAll, statusAndHeadersMiddleware);
    router.use.getCall(1).should.have.been.calledWithExactly("/", Sinon.match.func, endpoint, Sinon.match.func, SendResponseMiddleware);
  });
});
