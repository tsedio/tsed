import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {OidcNoCacheMiddleware} from "./OidcNoCacheMiddleware";

const sandbox = Sinon.createSandbox();

describe("OidcNoCacheMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should add headers", () => {
    const middleware = PlatformTest.get<OidcNoCacheMiddleware>(OidcNoCacheMiddleware);
    const ctx = PlatformTest.createRequestContext();
    sandbox.stub(ctx.response, "setHeader");

    middleware.use(ctx);

    expect(ctx.response.setHeader).to.have.been.calledWithExactly("Pragma", "no-cache");
    expect(ctx.response.setHeader).to.have.been.calledWithExactly("Cache-Control", "no-cache, no-store");
  });
});
