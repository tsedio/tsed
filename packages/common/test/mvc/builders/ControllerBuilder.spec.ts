import {Store} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import * as Sinon from "sinon";
import {
  ControllerBuilder,
  ControllerProvider,
  EndpointMetadata,
  EndpointRegistry,
  HandlerBuilder,
  SendResponseMiddleware
} from "../../../src/mvc";

class TestCtrl {
}

describe("ControllerBuilder", () => {
  const sandbox = Sinon.createSandbox();
  before(() => {
    sandbox.stub(HandlerBuilder, "from");
    sandbox.stub(Express, "Router");
    sandbox.stub(EndpointRegistry, "getEndpoints");
  });

  after(() => sandbox.restore());
  afterEach(() => {
    sandbox.resetHistory();
    sandbox.resetBehavior();

    Store.from(TestCtrl).clear();
  });

  it("should build controller with single endpoint", () => {
    // GIVEN
    const injector = new InjectorService();
    const provider = new ControllerProvider(TestCtrl);
    provider.middlewares = {
      use: [function controllerUse() {
      }],
      useAfter: [function controllerAfter() {
      }],
      useBefore: [function controllerBefore() {
      }]
    };

    const endpoint = new EndpointMetadata({target: TestCtrl, propertyKey: "test"});
    endpoint.before([function endpointBefore() {
    }]);
    endpoint.after([function endpointAfter() {
    }]);
    endpoint.middlewares = [function endpointUse() {
    }];
    endpoint.pathsMethods.push({
      path: "/",
      method: "get",
      isFinal: true
    });

    // @ts-ignore
    EndpointRegistry.getEndpoints.returns([endpoint]);

    const router = {
      get(...args: any) {
        return this.use(...args);
      },
      use: sandbox.stub()
    };

    // @ts-ignore
    HandlerBuilder.from.callsFake((middleware) => {
      return {
        build(injector: InjectorService) {
          injector.should.instanceOf(InjectorService);

          return middleware;
        }
      };
    });

    // @ts-ignore
    Express.Router.returns(router);

    const controllerProvider = new ControllerBuilder(provider);

    // WHEN
    const result = controllerProvider.build(injector);

    // THEN
    result.should.to.eq(router);
    router.use.callCount.should.deep.eq(3);
    router.use.getCall(0).should.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    // ENDPOINT
    router.use.getCall(1).should.have.been.calledWithExactly(
      "/",
      Sinon.match.func,
      provider.middlewares.use[0],
      endpoint.beforeMiddlewares[0],
      endpoint.middlewares[0],
      endpoint,
      endpoint.afterMiddlewares[0],
      SendResponseMiddleware
    );
    router.use.getCall(2).should.have.been.calledWithExactly(provider.middlewares.useAfter[0]); // controller
  });

  it("should build controller with only route configured", () => {
    // GIVEN
    const injector = new InjectorService();
    const provider = new ControllerProvider(TestCtrl);
    provider.middlewares = {
      use: [function controllerUse() {
      }],
      useAfter: [function controllerAfter() {
      }],
      useBefore: [function controllerBefore() {
      }]
    };

    const endpoint = new EndpointMetadata({target: TestCtrl, propertyKey: "test"});
    endpoint.before([function endpointBefore() {
    }]);
    endpoint.after([function endpointAfter() {
    }]);
    endpoint.middlewares = [function endpointUse() {
    }];

    endpoint.pathsMethods.push({
      path: "/"
    });
    // @ts-ignore
    EndpointRegistry.getEndpoints.returns([endpoint]);

    const router = {
      get(...args: any) {
        return this.use(...args);
      },
      use: sandbox.stub()
    };

    // @ts-ignore
    HandlerBuilder.from.callsFake((middleware) => {
      return {
        build(injector: InjectorService) {
          injector.should.instanceOf(InjectorService);

          return middleware;
        }
      };
    });

    // @ts-ignore
    Express.Router.returns(router);

    const controllerProvider = new ControllerBuilder(provider);

    // WHEN
    const result = controllerProvider.build(injector);

    // THEN
    result.should.to.eq(router);
    router.use.getCall(0).should.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    // ENDPOINT
    router.use.getCall(1).should.have.been.calledWithExactly(
      "/",
      Sinon.match.func,
      provider.middlewares.use[0],
      endpoint.beforeMiddlewares[0],
      endpoint.middlewares[0],
      endpoint,
      endpoint.afterMiddlewares[0]
    );

    router.use.getCall(2).should.have.been.calledWithExactly(provider.middlewares.useAfter[0]); // controller
  });

  it("should build controller without route and method", () => {
    // GIVEN
    const injector = new InjectorService();
    const provider = new ControllerProvider(TestCtrl);
    provider.middlewares = {
      use: [function controllerUse() {
      }],
      useAfter: [function controllerAfter() {
      }],
      useBefore: [function controllerBefore() {
      }]
    };

    const endpoint = new EndpointMetadata({target: TestCtrl, propertyKey: "test"});
    endpoint.before([function endpointBefore() {
    }]);
    endpoint.after([function endpointAfter() {
    }]);
    endpoint.middlewares = [function endpointUse() {
    }];

    // @ts-ignore
    EndpointRegistry.getEndpoints.returns([endpoint]);

    const router = {
      get(...args: any) {
        return this.use(...args);
      },
      use: sandbox.stub()
    };

    // @ts-ignore
    HandlerBuilder.from.callsFake((middleware) => {
      return {
        build(injector: InjectorService) {
          injector.should.instanceOf(InjectorService);

          return middleware;
        }
      };
    });

    // @ts-ignore
    Express.Router.returns(router);

    const controllerProvider = new ControllerBuilder(provider);

    // WHEN
    const result = controllerProvider.build(injector);

    // THEN
    result.should.to.eq(router);
    router.use.getCall(0).should.have.been.calledWithExactly(provider.middlewares.useBefore[0]); // controller

    // ENDPOINT
    router.use.getCall(1).should.have.been.calledWithExactly(
      Sinon.match.func,
      provider.middlewares.use[0],
      endpoint.beforeMiddlewares[0],
      endpoint.middlewares[0],
      endpoint,
      endpoint.afterMiddlewares[0]
    );

    router.use.getCall(2).should.have.been.calledWithExactly(provider.middlewares.useAfter[0]); // controller
  });

  it("should build controller with a all endpoint and get endpoint", () => {
    // GIVEN
    const injector = new InjectorService();
    const provider = new ControllerProvider(TestCtrl);
    const endpointGet = new EndpointMetadata({target: TestCtrl, propertyKey: "getMethod"});
    endpointGet.pathsMethods.push({
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
    EndpointRegistry.getEndpoints.returns([endpointAll, endpointGet]);

    const router = {
      all(...args: any) {
        return this.use(...args);
      },
      get(...args: any) {
        return this.use(...args);
      },
      use: sandbox.stub().returnsThis()
    };

    // @ts-ignore
    HandlerBuilder.from.callsFake((middleware) => {
      return {
        build(injector: InjectorService) {
          injector.should.instanceOf(InjectorService);

          return middleware;
        }
      };
    });

    // @ts-ignore
    Express.Router.returns(router);

    const controllerProvider = new ControllerBuilder(provider);

    // WHEN
    const result = controllerProvider.build(injector);

    // THEN
    result.should.to.eq(router);
    // ENDPOINT
    router.use.getCall(0).should.have.been.calledWithExactly(
      "/",
      Sinon.match.func,
      endpointAll
    );
    router.use.getCall(1).should.have.been.calledWithExactly(
      "/",
      Sinon.match.func,
      endpointGet,
      SendResponseMiddleware
    );
  });
});
