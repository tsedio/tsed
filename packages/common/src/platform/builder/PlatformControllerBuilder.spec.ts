import {All, ControllerProvider, Get, Use} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {OperationMethods} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";
import {EndpointMetadata} from "../../mvc/models/EndpointMetadata";
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

  provider.setRouter(injector.invoke<PlatformRouter>(PlatformRouter));

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

  // @ts-ignore
  EndpointMetadata.getEndpoints.returns([endpoint]);

  const controllerBuilder = new PlatformControllerBuilder(provider);

  return {endpoint, provider, injector, controllerBuilder, TestCtrl};
}

const sandbox = Sinon.createSandbox();
describe("PlatformControllerBuilder", () => {
  beforeEach(() => {
    // @ts-ignore
    sandbox.stub(EndpointMetadata, "getEndpoints");
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("should build controller with single endpoint", () => {
    // GIVEN
    const {endpoint, controllerBuilder, provider, injector} = getControllerBuilder({propertyKey: "getMethod"});

    endpoint.addOperationPath(OperationMethods.GET, "/", {isFinal: true});

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    expect(result).to.be.instanceof(PlatformRouter);

    // ENDPOINT
    const routes = provider.getRouter().getStacks();

    expect(routes).to.deep.eq([
      {
        method: "use",
        handlers: [provider.middlewares.useBefore[0]]
      },
      {
        method: "get",
        path: "/",
        endpoint,
        provider,
        isFinal: true,
        handlers: [
          routes[1].handlers[0],
          PlatformAcceptMimesMiddleware,
          provider.middlewares.use[0],
          endpoint.beforeMiddlewares[0],
          endpoint.middlewares[0],
          endpoint,
          endpoint.afterMiddlewares[0],
          provider.middlewares.useAfter[0]
        ]
      }
    ]);
  });

  it("should build controller with only route configured", () => {
    // GIVEN
    const {endpoint, controllerBuilder, provider, router, injector} = getControllerBuilder({propertyKey: "use"});

    endpoint.addOperationPath(OperationMethods.CUSTOM, "/");

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    expect(result).to.be.instanceof(PlatformRouter);

    const routes = provider.getRouter().getStacks();

    expect(routes).to.deep.eq([
      {
        method: "use",
        handlers: [provider.middlewares.useBefore[0]]
      },
      {
        method: "use",
        path: "/",
        endpoint,
        provider,
        isFinal: undefined,
        handlers: [
          routes[1].handlers[0],
          PlatformAcceptMimesMiddleware,
          provider.middlewares.use[0],
          endpoint.beforeMiddlewares[0],
          endpoint.middlewares[0],
          endpoint,
          endpoint.afterMiddlewares[0],
          provider.middlewares.useAfter[0]
        ]
      }
    ]);
  });

  it("should build controller without route and method", () => {
    // GIVEN
    const {endpoint, controllerBuilder, provider, injector} = getControllerBuilder({propertyKey: "use2"});

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    expect(result).to.be.instanceof(PlatformRouter);

    const routes = provider.getRouter().getStacks();

    expect(routes).to.deep.eq([
      {
        method: "use",
        handlers: [provider.middlewares.useBefore[0]]
      },
      {
        method: "use",
        handlers: [
          routes[1].handlers[0],
          PlatformAcceptMimesMiddleware,
          provider.middlewares.use[0],
          endpoint.beforeMiddlewares[0],
          endpoint.middlewares[0],
          endpoint,
          endpoint.afterMiddlewares[0],
          provider.middlewares.useAfter[0]
        ]
      }
    ]);
  });

  it("should build controller with a all endpoint and get endpoint", () => {
    // GIVEN
    const {endpoint, controllerBuilder, provider, injector, TestCtrl} = getControllerBuilder({
      propertyKey: "getMethod",
      withMiddleware: false
    });

    endpoint.addOperationPath(OperationMethods.GET, "/", {isFinal: true});

    const endpointAll = EndpointMetadata.get(TestCtrl, "allMethod");
    endpoint.addOperationPath(OperationMethods.ALL, "/", {isFinal: true});

    // @ts-ignore
    EndpointMetadata.getEndpoints.returns([endpointAll, endpoint]);

    // WHEN
    const result = controllerBuilder.build(injector);

    // THEN
    expect(result).to.be.instanceof(PlatformRouter);

    // ENDPOINT
    const routes = provider.getRouter().getStacks();

    expect(routes).to.deep.eq([
      {
        endpoint: endpointAll,
        handlers: [routes[0].handlers[0], PlatformAcceptMimesMiddleware, endpointAll],
        isFinal: false,
        method: "all",
        path: "/",
        provider
      },
      {
        method: "get",
        path: "/",
        isFinal: true,
        provider,
        endpoint: endpoint,
        handlers: [routes[1].handlers[0], PlatformAcceptMimesMiddleware, endpoint]
      },
      {
        endpoint: endpoint,
        handlers: [routes[2].handlers[0], PlatformAcceptMimesMiddleware, endpoint],
        isFinal: true,
        method: "all",
        path: "/",
        provider
      }
    ]);
  });
});
