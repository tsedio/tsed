import {InjectorService} from "@tsed/di";
import {inject} from "@tsed/testing";
import {expect} from "chai";
import {createReadStream} from "fs";
import {of} from "rxjs";
import * as Sinon from "sinon";
import {BadRequest} from "ts-httpexceptions";
import {$log} from "ts-log-debug";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {$logStub} from "../../../../../test/helper/tools";
import {Metadata} from "../../../../core/src";
import {FilterBuilder} from "../../../src/filters/class/FilterBuilder";
import {
  EXPRESS_ERR,
  EXPRESS_NEXT_FN,
  EXPRESS_REQUEST,
  EXPRESS_RESPONSE,
  PARAM_METADATA
} from "../../../src/filters/constants";
import {HandlerMetadata} from "../../../src/mvc";
import {EndpointMetadata} from "../../../src/mvc/class/EndpointMetadata";
import {HandlerBuilder} from "../../../src/mvc/class/HandlerBuilder";
import {HandlerType} from "../../../src/mvc/interfaces/HandlerType";

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
        const handlerMetadata = HandlerBuilder.resolve(new EndpointMetadata(Test, "get"), injector);

        // THEN
        handlerMetadata.target.should.eq(Test);
        handlerMetadata.methodClassName.should.eq("get");
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
        handlerMetadata.methodClassName.should.eq("use");
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
        const builder: any = HandlerBuilder.from(new EndpointMetadata(Test, "get"));
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
    const sandbox = Sinon.createSandbox();
    before(() => {
      sandbox.stub(HandlerBuilder.prototype as any, "invoke");
      sandbox.stub(FilterBuilder.prototype, "build");
    });

    after(() => {
      sandbox.restore();
    });

    afterEach(() => {
      sandbox.resetHistory();
    });

    describe("when is a middleware", () => {
      it("should have called invoke method with the correct parameters", inject([InjectorService], (injector: InjectorService) => {
        // GIVEN
        const handlerMetadata = new HandlerMetadata({
          target: Test,
          type: HandlerType.MIDDLEWARE,
          method: "use"
        });

        // WHEN
        const middleware: any = new HandlerBuilder(handlerMetadata).build(injector);
        middleware({request: "request"}, {response: "response"}, "function");

        // @ts-ignore
        HandlerBuilder.prototype.invoke.should.have.been.calledWithExactly({request: "request"}, {response: "response"}, "function");
        FilterBuilder.prototype.build.should.have.been.calledWithExactly({service: EXPRESS_REQUEST});
        FilterBuilder.prototype.build.should.have.been.calledWithExactly({service: EXPRESS_RESPONSE});
        FilterBuilder.prototype.build.should.have.been.calledWithExactly({service: EXPRESS_NEXT_FN});
      }));
    });

    describe("when is a middleware error", () => {
      it("should have called invoke method with the correct parameters", inject([InjectorService], (injector: InjectorService) => {
        // GIVEN
        const handlerMetadata = new HandlerMetadata({
          target: Test,
          type: HandlerType.MIDDLEWARE,
          method: "useErr"
        });
        const error = new Error();
        // WHEN
        const middleware: any = new HandlerBuilder(handlerMetadata).build(injector);
        middleware(error, {request: "request"}, {response: "response"}, "function");

        // @ts-ignore
        HandlerBuilder.prototype.invoke.should.have.been.calledWithExactly({request: "request"}, {response: "response"}, "function", error);
        FilterBuilder.prototype.build.should.have.been.calledWithExactly({service: EXPRESS_REQUEST});
        FilterBuilder.prototype.build.should.have.been.calledWithExactly({service: EXPRESS_RESPONSE});
        FilterBuilder.prototype.build.should.have.been.calledWithExactly({service: EXPRESS_NEXT_FN});
        FilterBuilder.prototype.build.should.have.been.calledWithExactly({service: EXPRESS_ERR});
      }));
    });

    describe("when is a controller injectable", () => {
      it("should have called invoke method with the correct parameters", inject([InjectorService], (injector: InjectorService) => {
        // GIVEN
        Metadata.set(PARAM_METADATA, [{service: EXPRESS_NEXT_FN}, {service: EXPRESS_ERR}], Test, "get");
        const handlerMetadata = new HandlerMetadata({
          target: Test,
          type: HandlerType.CONTROLLER,
          method: "get"
        });

        const error = new Error();
        // WHEN
        const middleware: any = new HandlerBuilder(handlerMetadata).build(injector);
        middleware(error, {request: "request"}, {response: "response"}, "function");

        // @ts-ignore
        HandlerBuilder.prototype.invoke.should.have.been.calledWithExactly({request: "request"}, {response: "response"}, "function", error);
        FilterBuilder.prototype.build.should.have.been.calledWithExactly({service: EXPRESS_NEXT_FN});
        FilterBuilder.prototype.build.should.have.been.calledWithExactly({service: EXPRESS_ERR});

        Metadata.set(PARAM_METADATA, undefined, Test, "get");
      }));
    });
  });
  describe("buildNext()", () => {
    describe("when header is not sent", () => {
      it("should change the nextCalled state", () => {
        // GIVEN
        $logStub.reset();
        const handlerMetadata: any = {};
        const handlerBuilder: any = new HandlerBuilder(handlerMetadata);
        const nextStub: any = Sinon.stub();
        const infoStub = Sinon.stub(handlerBuilder as any, "log").returns("log");

        // WHEN
        handlerBuilder.buildNext({tagId: "1"}, {}, nextStub)();

        // THEN
        expect(nextStub.isCalled).to.eq(true);
        infoStub.should.have.been.calledWithExactly({tagId: "1"}, {
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

        handlerBuilder.buildNext({tagId: "1"}, {headersSent: true}, nextStub)();

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
        method: "get",
        type: HandlerType.CONTROLLER
      });

      const request = new FakeRequest();
      request.ctx.data = "data";

      const handlerBuilder = new HandlerBuilder(metadata);
      // @ts-ignore
      handlerBuilder.debug = true;
      // WHEN
      // @ts-ignore
      handlerBuilder.log(request);

      request.log.debug.should.have.been.calledWithExactly({
        data: "data",
        injectable: false,
        methodName: "get",
        target: "Test",
        type: HandlerType.CONTROLLER
      }, false);
    });
  });
  describe("runFilters()", () => {
    describe("when success", () => {
      it("should call the filters", () => {
        // GIVEN
        const handlerMetadata = new HandlerMetadata({
          target: Test,
          method: "get",
          type: HandlerType.CONTROLLER
        });

        const handlerBuilder = new HandlerBuilder(handlerMetadata);
        // @ts-ignore
        handlerBuilder.filters = [Sinon.stub().returns("value1"), Sinon.stub().returns("value2")];

        // WHEN
        // @ts-ignore
        const result = handlerBuilder.runFilters("request", "response", "next", "err");


        // @ts-ignore
        handlerBuilder.filters[0].should.have.been.calledWithExactly({
          request: "request",
          response: "response",
          next: "next",
          err: "err"
        });
        // @ts-ignore
        handlerBuilder.filters[1].should.have.been.calledWithExactly({
          request: "request",
          response: "response",
          next: "next",
          err: "err"
        });
        expect(result).to.deep.eq(["value1", "value2"]);
      });
    });

    describe("when there is a bad request", () => {
      it("should call the filters", () => {
        // GIVEN
        const handlerMetadata = new HandlerMetadata({
          target: Test,
          method: "get",
          type: HandlerType.CONTROLLER
        });

        const handlerBuilder = new HandlerBuilder(handlerMetadata);
        // @ts-ignore
        handlerBuilder.filters = [Sinon.stub().throwsException(new BadRequest("BadRequest"))];
        // @ts-ignore
        handlerBuilder.filters[0].param = handlerMetadata;

        let error: any;
        try {
          // @ts-ignore
          handlerBuilder.runFilters("request", "response", "next", "err");
        } catch (er) {
          error = er;
        }

        // THEN
        // @ts-ignore
        handlerBuilder.filters[0].should.have.been.calledWithExactly({
          request: "request",
          response: "response",
          next: "next",
          err: "err"
        });

        expect(error.name).to.eq("BAD_REQUEST");
      });
    });

    describe("when an unknow error", () => {
      it("should call the filters", () => {
        const handlerMetadata = new HandlerMetadata({
          target: Test,
          method: "get",
          type: HandlerType.CONTROLLER
        });

        const handlerBuilder = new HandlerBuilder(handlerMetadata);
        // @ts-ignore
        handlerBuilder.filters = [Sinon.stub().throwsException(new Error("BadRequest"))];
        // @ts-ignore
        handlerBuilder.filters[0].param = handlerMetadata;

        // WHEN
        let error: any;
        try {
          // @ts-ignore
          handlerBuilder.runFilters("request", "response", "next", "err");
        } catch (er) {
          error = er;
        }

        // @ts-ignore
        handlerBuilder.filters[0].should.have.been.calledWithExactly({
          request: "request",
          response: "response",
          next: "next",
          err: "err"
        });

        expect(error.name).to.deep.eq(new Error("BadRequest").name);
      });
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
        HandlerBuilder.handle(process, {request, response, next, hasNextFunction});

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
        HandlerBuilder.handle(process, {request, response, next, hasNextFunction});

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
        HandlerBuilder.handle(process, {request, response, next, hasNextFunction});

        await process;
        // THEN
        request.ctx.data.should.be.equal("test");
        next.should.have.been.calledWithExactly();
      });

      it("should call next (promise reject)", async () => {
        // GIVEN
        const error = new Error();
        const process = Promise.reject(error);
        const request = new FakeRequest();
        const response = new FakeResponse(Sinon);
        const next = Sinon.stub();
        const hasNextFunction = false;

        // WHEN
        HandlerBuilder.handle(process, {request, response, next, hasNextFunction});

        try {
          await process;
        } catch (er) {
        }
        // THEN
        next.should.have.been.calledWithExactly(error);
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
        HandlerBuilder.handle(process, {request, response, next, hasNextFunction});

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
        HandlerBuilder.handle(process, {request, response, next, hasNextFunction});

        await process;
        // THEN
        request.ctx.data.should.deep.equal(["test"]);
        next.should.have.been.calledWithExactly();
      });
    });
  });
});
