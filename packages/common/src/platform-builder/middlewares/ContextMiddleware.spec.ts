import {expect} from "chai";
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
    expect(injector.emit).to.have.been.calledWithExactly("$onRequest", request, response);
    // expect(injector.emit).to.have.been.calledWithExactly("$onResponse", request, response);
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
    expect(injector.emit).to.have.been.calledWithExactly("$onRequest", request, response);
    // expect(injector.emit).to.have.been.calledWithExactly("$onResponse", request, response);

    expect(request.ctx.logger.id).to.deep.equal(request.ctx.id);
    expect(request.ctx.logger.id).to.equal("1");
  });
});
