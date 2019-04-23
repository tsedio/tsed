import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {InjectorService} from "../../../../di/src";
import {RequestLogger} from "../../../src/mvc";
import {LogIncomingRequestMiddleware} from "../../../src/server";

describe("LogIncomingRequestMiddleware", () => {
  describe("use()", () => {
    it("should configure request and create context logger (no debug, logRequest)", () => {
      // GIVEN
      const injector = new InjectorService();
      injector.settings.logger = {debug: false, logRequest: true};
      injector.logger = {
        info: Sinon.stub(),
        warn: Sinon.stub(),
        debug: Sinon.stub(),
        trace: Sinon.stub(),
        error: Sinon.stub()
      };

      const middleware = new LogIncomingRequestMiddleware(injector);

      const request = new FakeRequest();
      request.method = "GET";
      request.url = "url";
      request.originalUrl = "originalUrl";
      request.ctx.data = "test";

      const response = new FakeResponse();
      response.statusCode = 200;
      // WHEN
      middleware.use(request as any);

      // THEN
      request.log.should.instanceof(RequestLogger);
      request.log.id.should.deep.equal(request.ctx.id);

      // THEN
      middleware.$onResponse(request as any, response as any);

      // THEN
      injector.logger.info.should.have.been.calledWithExactly(Sinon.match({
        event: "request.start",
        method: "GET",
        reqId: "id",
        url: "originalUrl"
      }));
      injector.logger.info.should.have.been.calledWithExactly(Sinon.match({
        event: "request.end",
        method: "GET",
        reqId: "id",
        url: "originalUrl",
        status: 200
      }));
      injector.logger.info.should.have.been.calledWithExactly(Sinon.match.has("duration", Sinon.match.number));
      injector.logger.info.should.have.been.calledWithExactly(Sinon.match.has("time", Sinon.match.instanceOf(Date)));
    });
    it("should configure request and create context logger (debug, logRequest)", () => {
      // GIVEN
      const injector = new InjectorService();
      injector.settings.logger = {debug: true, logRequest: true};
      injector.logger = {
        info: Sinon.stub(),
        warn: Sinon.stub(),
        debug: Sinon.stub(),
        trace: Sinon.stub(),
        error: Sinon.stub()
      };

      const middleware = new LogIncomingRequestMiddleware(injector);

      const request = new FakeRequest();
      request.method = "GET";
      request.url = "url";
      request.ctx.data = "test";

      const response = new FakeResponse();
      response.statusCode = 200;
      // WHEN
      middleware.use(request as any);

      // THEN
      request.log.should.instanceof(RequestLogger);
      request.log.id.should.deep.equal(request.ctx.id);

      // THEN
      middleware.$onResponse(request as any, response as any);

      // THEN
      injector.logger.debug.should.have.been.calledWithExactly(Sinon.match({
        event: "request.start",
        method: "GET",
        reqId: "id",
        url: "url"
      }));
      injector.logger.debug.should.have.been.calledWithExactly(Sinon.match({
        event: "request.end",
        method: "GET",
        reqId: "id",
        url: "url",
        status: 200,
        data: "test"
      }));
      injector.logger.debug.should.have.been.calledWithExactly(Sinon.match.has("duration", Sinon.match.number));
      injector.logger.debug.should.have.been.calledWithExactly(Sinon.match.has("time", Sinon.match.instanceOf(Date)));
    });
  });
});
