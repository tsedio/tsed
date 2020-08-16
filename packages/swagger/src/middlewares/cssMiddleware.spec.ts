import {expect} from "chai";
import * as Fs from "fs";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../test/helper";
import {cssMiddleware} from "./cssMiddleware";

const sandbox = Sinon.createSandbox();
describe("cssMiddleware", () => {
  beforeEach(() => {
    sandbox.stub(Fs, "readFileSync").returns(".css{}");
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("should create a middleware", () => {
    const res = new FakeResponse(sandbox);
    const req = new FakeRequest();

    cssMiddleware("/path")(req as any, res as any);

    expect(res.set).to.have.been.calledWithExactly("Content-Type", "text/css");
    expect(res.status).to.have.been.calledWithExactly(200);
    expect(res.send).to.have.been.calledWithExactly(".css{}");
  });
});
