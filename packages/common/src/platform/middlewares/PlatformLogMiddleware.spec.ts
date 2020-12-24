import {PlatformRequest, PlatformResponse, PlatformTest} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {levels} from "@tsed/logger";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {PlatformLogMiddleware} from "./PlatformLogMiddleware";

function createContext(settings: any) {
  const injector = new InjectorService();
  injector.settings.logger = settings;
  injector.logger = {
    info: Sinon.stub(),
    warn: Sinon.stub(),
    debug: Sinon.stub(),
    trace: Sinon.stub(),
    error: Sinon.stub(),
    flush: Sinon.stub()
  };

  const middleware = new PlatformLogMiddleware(injector as any);

  const request = new FakeRequest();

  request.method = "GET";
  request.url = "url";
  // @ts-ignore
  request.originalUrl = undefined;

  const response = new FakeResponse();
  response.statusCode = 200;

  const ctx = PlatformTest.createRequestContext({
    request: new PlatformRequest(request as any),
    response: new PlatformResponse(response as any)
  });

  // @ts-ignore
  ctx.logger.logger = injector.logger;
  ctx.logger.maxStackSize = 0;
  ctx.data = "test";

  request.$ctx = ctx;

  return {request, ctx, injector, middleware};
}

describe("PlatformLogMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("use()", () => {
    it("should configure request and create context logger (no debug, logRequest)", () => {
      // GIVEN
      const {request, ctx, middleware, injector} = createContext({debug: false, logRequest: true});
      request.originalUrl = "originalUrl";
      // WHEN
      middleware.use(ctx);

      // THEN
      middleware.$onResponse(request.$ctx);

      // expect(stub(injector.logger.info).getCalls()[0].args[0]).to.deep.eq({});
      // THEN
      expect(injector.logger.info).to.have.been.calledWithExactly(
        Sinon.match({
          event: "request.start",
          method: "GET",
          reqId: "id",
          url: "originalUrl"
        })
      );
      expect(injector.logger.info).to.have.been.calledWithExactly(
        Sinon.match({
          event: "request.end",
          method: "GET",
          reqId: "id",
          url: "originalUrl",
          status: 200
        })
      );
      expect(injector.logger.info).to.have.been.calledWithExactly(Sinon.match.has("duration", Sinon.match.number));
      expect(injector.logger.info).to.have.been.calledWithExactly(Sinon.match.has("time", Sinon.match.instanceOf(Date)));
    });
    it("should configure request and create context logger (debug, logRequest)", () => {
      // GIVEN
      const {request, ctx, middleware, injector} = createContext({
        debug: true,
        logRequest: true
      });
      // @ts-ignore
      ctx.logger.level = levels().DEBUG;
      // WHEN
      middleware.use(ctx);

      // THEN
      middleware.$onResponse(request.$ctx as any);

      // THEN
      expect(injector.logger.debug).to.have.been.calledWithExactly(
        Sinon.match({
          event: "request.start",
          method: "GET",
          reqId: "id",
          url: "url"
        })
      );
      expect(injector.logger.debug).to.have.been.calledWithExactly(
        Sinon.match({
          event: "request.end",
          method: "GET",
          reqId: "id",
          url: "url",
          status: 200,
          data: "test"
        })
      );
      expect(injector.logger.debug).to.have.been.calledWithExactly(Sinon.match.has("duration", Sinon.match.number));
      expect(injector.logger.debug).to.have.been.calledWithExactly(Sinon.match.has("time", Sinon.match.instanceOf(Date)));
    });
    it("should configure request and create context logger (no debug, logRequest, logEnd)", () => {
      // GIVEN
      const {request, ctx, middleware, injector} = createContext({debug: false, logRequest: true, logEnd: false});
      request.originalUrl = "originalUrl";

      // WHEN
      middleware.use(ctx);

      // THEN
      middleware.$onResponse(request.$ctx as any);

      // THEN
      expect(injector.logger.info).to.have.been.calledWithExactly(
        Sinon.match({
          event: "request.start"
        })
      );
      expect(injector.logger.info).to.have.been.calledWithExactly(Sinon.match.has("duration", Sinon.match.number));
      expect(injector.logger.info).to.have.been.calledWithExactly(Sinon.match.has("time", Sinon.match.instanceOf(Date)));
    });
    it("should configure request and create context logger (no debug, logRequest, logStart)", () => {
      // GIVEN
      const {request, ctx, middleware, injector} = createContext({debug: false, logRequest: true, logStart: false});

      // WHEN
      middleware.use(ctx);

      // THEN
      middleware.$onResponse(request.$ctx as any);

      // THEN
      expect(injector.logger.info).to.have.been.calledWithExactly(
        Sinon.match({
          event: "request.end",
          method: "GET",
          reqId: "id",
          url: "url",
          status: 200
        })
      );
      expect(injector.logger.info).to.have.been.calledWithExactly(Sinon.match.has("duration", Sinon.match.number));
      expect(injector.logger.info).to.have.been.calledWithExactly(Sinon.match.has("time", Sinon.match.instanceOf(Date)));
    });
  });
});
