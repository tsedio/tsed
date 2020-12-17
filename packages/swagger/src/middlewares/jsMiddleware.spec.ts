import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Fs from "fs";
import Sinon from "sinon";
import {createFakePlatformContext} from "../../../../test/helper/createFakePlatformContext";
import {jsMiddleware} from "./jsMiddleware";

const sandbox = Sinon.createSandbox();
describe("jsMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  beforeEach(() => {
    sandbox.stub(Fs, "readFileSync").returns("var test=1");
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("should create a middleware", () => {
    const ctx = createFakePlatformContext(sandbox);

    jsMiddleware("/path")(ctx);

    expect(ctx.response.raw.set).to.have.been.calledWithExactly("Content-Type", "application/javascript");
    expect(ctx.response.raw.status).to.have.been.calledWithExactly(200);
    expect(ctx.response.raw.send).to.have.been.calledWithExactly("var test=1");
  });
});
