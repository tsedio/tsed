import {InjectorService} from "@tsed/di";
import * as Sinon from "sinon";
import {ContextMiddleware} from "./ContextMiddleware";

describe("contextMiddleware", () => {
  const sandbox = Sinon.createSandbox();
  it("should create context and attach it to the request", async () => {
    // GIVEN
    const injector = new InjectorService();
    const request: any = {};
    const response: any = {
      send: sandbox.stub(),
      end: sandbox.stub(),
      req: request
    };

    const next = sandbox.stub();

    sandbox.stub(injector, "emit");

    // WHEN
    const middleware = new ContextMiddleware(injector);
    await middleware.use(request, response, next);

    // response.send({});

    // THEN
    injector.emit.should.have.been.calledWithExactly("$onRequest", request, response);
    // injector.emit.should.have.been.calledWithExactly("$onResponse", request, response);

    request.log.id.should.deep.equal(request.ctx.id);
  });

  it("should create context and attach it to the request with reqIdBuilder", async () => {
    // GIVEN
    const injector = new InjectorService();
    const request: any = {};
    const response: any = {
      end: sandbox.stub(),
      req: request
    };

    const next = sandbox.stub();

    injector.settings.set("logger", {
      reqIdBuilder() {
        return "1";
      },
      ignoreUrlPatterns: []
    });

    sandbox.stub(injector, "emit");

    // WHEN
    const middleware = new ContextMiddleware(injector);
    await middleware.use(request, response, next);

    // response.end();

    // THEN
    injector.emit.should.have.been.calledWithExactly("$onRequest", request, response);
    // injector.emit.should.have.been.calledWithExactly("$onResponse", request, response);

    request.ctx.logger.id.should.deep.equal(request.ctx.id);
    request.ctx.logger.id.should.equal("1");
  });
});
