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

  it("should build controller (1)", () => {
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

  it("should build controller (2)", () => {
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

  it("should build controller (3)", () => {
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
});
