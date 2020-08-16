import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../test/helper";
import {redirectMiddleware} from "./redirectMiddleware";

const sandbox = Sinon.createSandbox();
describe("redirectMiddleware and redirect", () => {
  it("should create a middleware", () => {
    const res = new FakeResponse(sandbox);
    const req = new FakeRequest();
    const next = sandbox.stub();
    req.url = "/path";

    redirectMiddleware("/path")(req as any, res as any, next);

    expect(res.redirect).to.have.been.calledWithExactly("/path/");
  });
  it("should create a middleware and call next", () => {
    const res = new FakeResponse(sandbox);
    const req = new FakeRequest();
    const next = sandbox.stub();
    req.url = "/path/";

    redirectMiddleware("/path")(req as any, res as any, next);

    expect(next).to.have.been.calledWithExactly();
  });
});
