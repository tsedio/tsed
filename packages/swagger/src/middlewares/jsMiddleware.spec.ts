import {expect} from "chai";
import * as Fs from "fs";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../test/helper";
import {jsMiddleware} from "./jsMiddleware";

const sandbox = Sinon.createSandbox();
describe("jsMiddleware", () => {
  beforeEach(() => {
    sandbox.stub(Fs, "readFileSync").returns("var test=1");
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("should create a middleware", () => {
    const res = new FakeResponse(sandbox);
    const req = new FakeRequest();

    jsMiddleware("/path")(req as any, res as any);

    expect(res.set).to.have.been.calledWithExactly("Content-Type", "application/javascript");
    expect(res.status).to.have.been.calledWithExactly(200);
    expect(res.send).to.have.been.calledWithExactly("var test=1");
  });
});
