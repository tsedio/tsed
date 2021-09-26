import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {redirectMiddleware} from "./redirectMiddleware";

const sandbox = Sinon.createSandbox();
describe("redirectMiddleware and redirect", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should create a middleware", () => {
    const ctx = PlatformTest.createRequestContext();
    sandbox.stub(ctx.response.raw, "redirect");
    ctx.request.raw.url = "/path";
    ctx.request.raw.originalUrl = "/path";

    redirectMiddleware("/path")(ctx);

    expect(ctx.response.raw.redirect).to.have.been.calledWithExactly(302, "/path/");
  });
  it("should create a middleware and call next", () => {
    const ctx = PlatformTest.createRequestContext();
    sandbox.stub(ctx.response.raw, "redirect");
    ctx.request.raw.url = "/path/";
    ctx.request.raw.originalUrl = "/path/";

    redirectMiddleware("/path")(ctx);

    expect(ctx.response.raw.redirect).to.not.have.been.called;
  });
});
