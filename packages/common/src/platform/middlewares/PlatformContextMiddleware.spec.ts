import {InjectorService} from "@tsed/di";
import {expect} from "chai";
import * as Sinon from "sinon";
import {PlatformContextMiddleware} from "./PlatformContextMiddleware";

describe("PlatformContextMiddleware", () => {
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
    const middleware = new PlatformContextMiddleware(injector);
    await middleware.use(request, response, next);

    // THEN
    expect(injector.emit).to.have.been.calledWithExactly("$onRequest", request, response);

    expect(request.log.id).to.deep.equal(request.ctx.id);
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
    const middleware = new PlatformContextMiddleware(injector);
    await middleware.use(request, response, next);

    // THEN
    expect(injector.emit).to.have.been.calledWithExactly("$onRequest", request, response);

    expect(request.$ctx.logger.id).to.deep.equal(request.ctx.id);
    expect(request.$ctx.logger.id).to.equal("1");
  });
});
