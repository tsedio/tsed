import {InjectorService} from "@tsed/di";
import {expect} from "chai";
import {createReadStream} from "fs";
import {of} from "rxjs";
import * as Sinon from "sinon";
import {$log} from "ts-log-debug";
import {promisify} from "util";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {$logStub} from "../../../../../test/helper/logger";
import {stub} from "../../../../../test/helper/tools";
import {inject} from "../../../../testing/src";
import {
  EndpointMetadata,
  Err,
  HandlerBuilder,
  HandlerMetadata,
  HandlerType,
  ParamBuilder,
  Required
} from "../../../src/mvc";
import {BodyParams} from "../../../src/mvc/decorators/params/bodyParams";

class Test {
  get() {
  }

  use(req: any, res: any, next: any) {
  }

  useErr(err: any, req: any, res: any, next: any) {
  }
}


describe("HandlerBuilder", () => {
  describe("resolve", () => {
    const sandbox = Sinon.createSandbox();
    before(() => {
      const fn: any = () => {
      };
      sandbox.stub(HandlerBuilder.prototype, "build").returns(fn);
    });

    after(() => {
      sandbox.restore();
    });

    afterEach(() => {
      sandbox.resetHistory();
    });

    describe("from Endpoint", () => {
      it("should return metadata", () => {
        // GIVEN
        const injector: any = {
          getProvider: sandbox.stub().returns({
            useClass: Test
          })
        };

        // WHEN
        const handlerMetadata = HandlerBuilder.resolve(new EndpointMetadata({
          target: Test,
          propertyKey: "get"
        }), injector);

        // THEN
        handlerMetadata.target.should.eq(Test);
        handlerMetadata.propertyKey.should.eq("get");
        handlerMetadata.type.should.eq(HandlerType.CONTROLLER);
      });
    });

    describe("from Middleware", () => {
      it("should return metadata", () => {
        // GIVEN
        const injector: any = {
          getProvider: sandbox.stub().returns({
            useClass: Test
          })
        };

        // WHEN
        const handlerMetadata = HandlerBuilder.resolve(Test, injector);

        // THEN
        handlerMetadata.target.should.eq(Test);
        handlerMetadata.propertyKey.should.eq("use");
        handlerMetadata.type.should.eq(HandlerType.MIDDLEWARE);
      });
    });

    describe("from Function", () => {
      it("should return metadata", () => {
        // GIVEN
        const injector: any = {
          getProvider: sandbox.stub().returns(undefined)
        };

        // WHEN
        const handlerMetadata = HandlerBuilder.resolve(() => {
        }, injector);

        // THEN
        handlerMetadata.type.should.eq(HandlerType.FUNCTION);
      });
    });
  });
  describe("from()", () => {
    const sandbox = Sinon.createSandbox();
    before(() => {
      const fn: any = () => {
      };
      sandbox.stub(HandlerBuilder.prototype, "build").returns(fn);
    });

    after(() => {
      sandbox.restore();
    });

    afterEach(() => {
      sandbox.resetHistory();
    });

    describe("from Endpoint", () => {
      it("should create builder", () => {
        // GIVEN
        const injector = new InjectorService();
        injector.settings.debug = false;
        injector.logger = $log;

        sandbox.stub(injector, "getProvider").returns({
          useClass: Test
        } as any);
        // WHEN
        const builder: any = HandlerBuilder.from(new EndpointMetadata({target: Test, propertyKey: "get"}));
        const handler = builder.build(injector);
        // THEN
        injector.getProvider.should.have.been.calledWithExactly(Test);
        // @ts-ignore
        HandlerBuilder.prototype.build.should.have.been.calledWithExactly(injector);
        handler.should.be.a("function");
      });
    });

    describe("from Middleware", () => {
      it("should create builder", () => {
        // GIVEN
        const injector = new InjectorService();
        injector.settings.debug = false;
        injector.logger = $log;

        sandbox.stub(injector, "getProvider").returns({
          useClass: Test
        } as any);

        // WHEN
        const builder: any = HandlerBuilder.from(Test);
        const handler = builder.build(injector);

        // THEN
        injector.getProvider.should.have.been.calledWithExactly(Test);

        // @ts-ignore
        HandlerBuilder.prototype.build.should.have.been.calledWithExactly(injector);
        handler.should.be.a("function");
      });
    });

    describe("from Function", () => {
      it("should create builder", () => {
        // GIVEN
        const target = () => {
        };

        const injector = new InjectorService();
        injector.settings.debug = false;
        injector.logger = $log;

        sandbox.stub(injector, "getProvider").returns(undefined);

        // WHEN
        const builder: any = HandlerBuilder.from(target);
        const handler = builder.build(injector);
        // THEN
        // HandlerBuilder.prototype.build.should.have.been.calledWithExactly(injector);
        handler.should.eq(target);
      });
    });
  });
  describe("build()", () => {
    describe("when return value", () => {
      it("should return value", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        class Test {
          test() {
            return "test";
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        const request = new FakeRequest();
        const response = new FakeResponse();

        // WHEN
        const result = await promisify(handler)(request, response);

        // THEN
        expect(result).to.eq(undefined);
        expect(request.ctx.data).to.eq("test");
      }));
    });
    describe("when return value (called twice)", () => {
      it("should return value", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        class Test {
          test() {
            return "test";
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);


        // WHEN
        const request = new FakeRequest();
        const response = new FakeResponse();
        const result = await promisify(handler)(request, response);

        const request2 = new FakeRequest();
        const response2 = new FakeResponse();
        const result2 = await promisify(handler)(request2, response2);

        // THEN
        expect(result).to.eq(undefined);
        expect(request.ctx.data).to.eq("test");
        expect(result2).to.eq(undefined);
        expect(request2.ctx.data).to.eq("test");
      }));
    });

    describe("when there is an error in handler", () => {
      it("should return value", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        class Test {
          test(@Err() error: any) {
            return error.message;
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        const request = new FakeRequest();
        const response = new FakeResponse();

        // WHEN
        const result = await promisify(handler)(new Error("test error"), request, response);

        // THEN
        expect(result).to.eq(undefined);
        expect(request.ctx.data).to.eq("test error");
      }));
    });
    describe("when there is  an error in params", () => {
      it("should return value", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        class Test {
          test(@BodyParams("user") @Required() user: any) {
            return "";
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        const request = new FakeRequest();
        const response = new FakeResponse();

        // WHEN
        let actualError: any;
        try {
          await promisify(handler)(request, response);
        } catch (er) {
          actualError = er;
        }

        // THEN
        expect(actualError.message).to.eq("Bad request, parameter \"request.body.user\" is required.");
      }));
    });
    describe("when there is  an error in params (called twice)", () => {
      it("should return value", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        class Test {
          test(@BodyParams("user") @Required() user: any) {
            return "wrong";
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        // WHEN
        let actualError: any;
        try {
          const request = new FakeRequest();
          const response = new FakeResponse();
          await promisify(handler)(request, response);
        } catch (er) {
          actualError = er;
        }

        // THEN
        expect(actualError.message).to.eq("Bad request, parameter \"request.body.user\" is required.");

        // WHEN
        let actualError2: any;
        try {
          const request = new FakeRequest();
          const response = new FakeResponse();
          console.log(await promisify(handler)(request, response));
          console.log(request.ctx.data);
        } catch (er) {
          actualError2 = er;
        }

        // THEN
        expect(actualError2.message).to.eq("Bad request, parameter \"request.body.user\" is required.");
      }));
    });

    describe("when throw Error", () => {
      it("should catch error", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        const error = new Error("test");

        class Test {
          test() {
            throw error;
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        const request = new FakeRequest();
        const response = new FakeResponse();

        // WHEN
        let actualError;
        try {
          await promisify(handler)(request, response);
        } catch (er) {
          actualError = er;
        }

        // THEN
        expect(actualError).to.eq(error);
        expect(request.ctx.data).to.eq(undefined);
      }));
    });

    describe("when return Promise", () => {
      it("should return value", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        class Test {
          async test() {
            return await "test";
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        const request = new FakeRequest();
        const response = new FakeResponse();

        // WHEN
        const result = await promisify(handler)(request, response);

        // THEN
        expect(result).to.eq(undefined);
        expect(request.ctx.data).to.eq("test");
      }));
    });

    describe("when reject Error", () => {
      it("should catch error", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        const error = new Error("test");

        class Test {
          test() {
            return Promise.reject(error);
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        const request = new FakeRequest();
        const response = new FakeResponse();

        // WHEN
        let actualError;
        try {
          await promisify(handler)(request, response);
        } catch (er) {
          actualError = er;
        }

        // THEN
        expect(actualError).to.eq(error);
        expect(request.ctx.data).to.eq(undefined);
      }));
    });

    describe("when return Observable", () => {
      it("should return value", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        class Test {
          async test() {
            return of("test");
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        const request = new FakeRequest();
        const response = new FakeResponse();

        // WHEN
        const result = await promisify(handler)(request, response);

        // THEN
        expect(result).to.eq(undefined);
        expect(request.ctx.data).to.eq("test");
      }));
    });

    describe("when return Function as middleware", () => {
      before(() => {
        Sinon.spy(ParamBuilder.prototype, "build");
      });
      after(() => {
        stub(ParamBuilder.prototype.build).restore();
      });
      it("should return value", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        class Test {
          async test() {
            return (request: any, response: any, next: any) => {
              request.ctx.data = "test";
              next();
            };
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        const request = new FakeRequest();
        const response = new FakeResponse();

        // WHEN
        const result = await promisify(handler)(request, response);

        // THEN
        expect(result).to.eq(undefined);
        expect(request.ctx.data).to.eq("test");

        ParamBuilder.prototype.build.should.have.been.calledWithExactly(injector);
      }));
    });

    describe("when return Stream", () => {
      it("should return value", inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        const stream = createReadStream(__dirname + "/data/response.txt");

        class Test {
          async test() {
            return stream;
          }
        }

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          propertyKey: "test",
          type: HandlerType.CONTROLLER
        });

        const handler = new HandlerBuilder(handlerMetadata).build(injector);

        const request = new FakeRequest();
        const response = new FakeResponse();

        // WHEN
        const result = await promisify(handler)(request, response);

        // THEN
        expect(result).to.eq(undefined);
        expect(request.ctx.data).to.eq(stream);
      }));
    });
  });
  // describe("build()", () => {
  //   const sandbox = Sinon.createSandbox();
  //   before(() => {
  //     sandbox.stub(HandlerBuilder.prototype as any, "invoke");
  //     sandbox.stub(ParamBuilder.prototype, "build");
  //   });
  //
  //   after(() => {
  //     sandbox.restore();
  //   });
  //
  //   afterEach(() => {
  //     sandbox.resetHistory();
  //   });
  //
  //   describe("when is a middleware", () => {
  //     it("should have called invoke method with the correct parameters", inject([InjectorService], (injector: InjectorService) => {
  //       // GIVEN
  //       const handlerMetadata = new HandlerMetadata({
  //         target: Test,
  //         type: HandlerType.MIDDLEWARE,
  //         propertyKey: "use"
  //       });
  //
  //       // WHEN
  //       const middleware: any = new HandlerBuilder(handlerMetadata).build(injector);
  //       middleware({request: "request"}, {response: "response"}, "function");
  //
  //       // @ts-ignore
  //       HandlerBuilder.prototype.invoke.should.have.been.calledWithExactly({request: "request"}, {response: "response"}, "function");
  //       ParamBuilder.prototype.build.should.have.been.calledWithExactly({service: ParamTypes.REQUEST});
  //       ParamBuilder.prototype.build.should.have.been.calledWithExactly({service: ParamTypes.RESPONSE});
  //       ParamBuilder.prototype.build.should.have.been.calledWithExactly({service: ParamTypes.NEXT_FN});
  //     }));
  //   });
  //
  //   describe("when is a middleware error", () => {
  //     it("should have called invoke method with the correct parameters", inject([InjectorService], (injector: InjectorService) => {
  //       // GIVEN
  //       const handlerMetadata = new HandlerMetadata({
  //         target: Test,
  //         type: HandlerType.MIDDLEWARE,
  //         propertyKey: "useErr"
  //       });
  //       const error = new Error();
  //       // WHEN
  //       const middleware: any = new HandlerBuilder(handlerMetadata).build(injector);
  //       middleware(error, {request: "request"}, {response: "response"}, "function");
  //
  //       // @ts-ignore
  //       HandlerBuilder.prototype.invoke.should.have.been.calledWithExactly({request: "request"}, {response: "response"}, "function", error);
  //       ParamBuilder.prototype.build.should.have.been.calledWithExactly({service: ParamTypes.REQUEST});
  //       ParamBuilder.prototype.build.should.have.been.calledWithExactly({service: ParamTypes.RESPONSE});
  //       ParamBuilder.prototype.build.should.have.been.calledWithExactly({service: ParamTypes.NEXT_FN});
  //       ParamBuilder.prototype.build.should.have.been.calledWithExactly({service: ParamTypes.ERR});
  //     }));
  //   });
  //
  //   describe("when is a controller injectable", () => {
  //     it("should have called invoke method with the correct parameters", inject([InjectorService], (injector: InjectorService) => {
  //       // GIVEN
  //       Metadata.set(PARAM_METADATA, [{service: ParamTypes.NEXT_FN}, {service: ParamTypes.ERR}], Test, "get");
  //       const handlerMetadata = new HandlerMetadata({
  //         target: Test,
  //         type: HandlerType.CONTROLLER,
  //         propertyKey: "get"
  //       });
  //
  //       const error = new Error();
  //       // WHEN
  //       const middleware: any = new HandlerBuilder(handlerMetadata).build(injector);
  //       middleware(error, {request: "request"}, {response: "response"}, "function");
  //
  //       // @ts-ignore
  //       HandlerBuilder.prototype.invoke.should.have.been.calledWithExactly({request: "request"}, {response: "response"}, "function", error);
  //       ParamBuilder.prototype.build.should.have.been.calledWithExactly({service: ParamTypes.NEXT_FN});
  //       ParamBuilder.prototype.build.should.have.been.calledWithExactly({service: ParamTypes.ERR});
  //
  //       Metadata.set(PARAM_METADATA, undefined, Test, "get");
  //     }));
  //   });
  // });
  describe("buildNext()", () => {
    describe("when header is not sent", () => {
      it("should change the nextCalled state", () => {
        // GIVEN
        $logStub.reset();
        const handlerMetadata: any = {};
        const handlerBuilder: any = new HandlerBuilder(handlerMetadata);
        const nextStub: any = Sinon.stub();
        const infoStub = Sinon.stub(handlerBuilder as any, "log").returns("log");
        const context = {request: {tagId: "1"}, response: {}, next: nextStub};

        // WHEN
        handlerBuilder.buildNext(context)();

        // THEN
        expect(nextStub.isCalled).to.eq(true);
        infoStub.should.have.been.calledWithExactly(context, {
          error: undefined,
          event: "invoke.end",
          execTime: Sinon.match.number
        });
      });
    });

    describe("when header is sent", () => {
      before(() => {
        $logStub.reset();
        const handlerMetadata: any = {};
        const handlerBuilder: any = new HandlerBuilder(handlerMetadata);

        const nextStub: any = Sinon.stub();
        const infoStub = Sinon.stub(handlerBuilder, "log").returns("log");

        handlerBuilder.buildNext({request: {tagId: "1"}, response: {headersSent: true}, next: nextStub})();

        expect(nextStub.isCalled).to.eq(true);

        return infoStub.should.not.have.been.called && $logStub.debug.should.not.have.been.called;
      });
    });
  });
  describe("log", () => {
    it("should create a log", () => {
      // GIVEN
      const metadata = new HandlerMetadata({
        target: Test,
        propertyKey: "get",
        type: HandlerType.CONTROLLER
      });

      const request = new FakeRequest();
      request.ctx.data = "data";

      const handlerBuilder = new HandlerBuilder(metadata);
      // @ts-ignore
      handlerBuilder.debug = true;
      // WHEN
      // @ts-ignore
      handlerBuilder.log({request});

      request.log.debug.should.have.been.calledWithExactly({
        data: "data",
        injectable: false,
        methodName: "get",
        target: "Test",
        type: HandlerType.CONTROLLER
      }, false);
    });
  });

  describe("handle()", () => {
    describe("when process is a response", () => {
      it("should exec the function", () => {
        // GIVEN
        const request = new FakeRequest();
        const response = new FakeResponse(Sinon);
        const next = Sinon.stub();
        const hasNextFunction = true;
        const process = response;

        // WHEN
        // @ts-ignore
        HandlerBuilder.handle(process, {request, response, next, handler: {hasNextFunction}});

        // THEN
        return next.should.not.have.been.called;
      });
    });
    describe("when process is a Function", () => {
      it("should exec the function", () => {
        // GIVEN
        const process = Sinon.stub();
        const request = new FakeRequest();
        const response = new FakeResponse(Sinon);
        const next = Sinon.stub();
        const hasNextFunction = true;

        // WHEN
        // @ts-ignore
        HandlerBuilder.handle(process, {request, response, next, handler: {hasNextFunction}});

        // THEN
        process.should.have.been.calledWithExactly(request, response, next);

        return next.should.not.have.been.called;
      });
    });
    describe("when process is a Promise", () => {
      it("should call next (promise resolved)", async () => {
        // GIVEN
        const process = Promise.resolve("test");
        const request = new FakeRequest();
        const response = new FakeResponse(Sinon);
        const next = Sinon.stub();
        const hasNextFunction = false;

        // WHEN
        // @ts-ignore
        HandlerBuilder.handle(process, {request, response, next, handler: {hasNextFunction}});

        await process;
        // THEN
        request.ctx.data.should.be.equal("test");
        next.should.have.been.calledWithExactly();
      });

      it("should call next (promise reject)", (done) => {
        // GIVEN
        const error = new Error();
        const process = Promise.reject(error);
        const request = new FakeRequest();
        const response = new FakeResponse(Sinon);
        const hasNextFunction = false;
        const next = (err: any) => {
          err.should.eq(error);
          done();
        };

        // WHEN
        // @ts-ignore
        HandlerBuilder.handle(process, {request, response, next, handler: {hasNextFunction}});
      });
    });
    describe("when process is a stream", () => {
      it("should pipe stream with the response", async () => {
        // GIVEN
        const request = new FakeRequest();
        const response = new FakeResponse(Sinon);
        const next = Sinon.stub();
        const hasNextFunction = false;
        const process = createReadStream(__dirname + "/data/response.txt");

        // WHEN
        // @ts-ignore
        HandlerBuilder.handle(process, {request, response, next, handler: {hasNextFunction}});

        await process;

        // THEN
        request.ctx.data.should.deep.equal(process);
        next.should.have.been.calledWithExactly();
      });
    });
    describe("when process is an Observable", () => {
      it("should call next (promise resolved)", async () => {
        // GIVEN
        const process = of(["test"]);
        const request = new FakeRequest();
        const response = new FakeResponse(Sinon);
        const next = Sinon.stub();
        const hasNextFunction = false;

        // WHEN
        // @ts-ignore
        HandlerBuilder.handle(process, {request, response, next, handler: {hasNextFunction}});

        await process;
        // THEN
        request.ctx.data.should.deep.equal(["test"]);
        next.should.have.been.calledWithExactly();
      });
    });
  });
});
