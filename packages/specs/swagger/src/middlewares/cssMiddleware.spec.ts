import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Fs from "fs";
import Sinon from "sinon";
import {createFakePlatformContext} from "../../../../../test/helper/createFakePlatformContext";
import {cssMiddleware} from "./cssMiddleware";

const sandbox = Sinon.createSandbox();
describe("cssMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  beforeEach(() => {
    sandbox.stub(Fs, "readFileSync").returns(".css{}");
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("should create a middleware", () => {
    const ctx = createFakePlatformContext(sandbox);

    cssMiddleware("/path")(ctx);

    expect(ctx.response.raw.set).to.have.been.calledWithExactly("Content-Type", "text/css");
    expect(ctx.response.raw.status).to.have.been.calledWithExactly(200);
    expect(ctx.response.raw.send).to.have.been.calledWithExactly(".css{}");
  });
});
