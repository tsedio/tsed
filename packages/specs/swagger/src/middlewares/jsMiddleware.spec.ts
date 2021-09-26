import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Fs from "fs";
import Sinon from "sinon";
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
    const ctx = PlatformTest.createRequestContext();

    jsMiddleware("/path")(ctx);

    expect(ctx.response.raw.headers).to.deep.eq({
      "content-type": "application/javascript",
      "x-request-id": "id"
    });
    expect(ctx.response.raw.statusCode).to.eq(200);
    expect(ctx.response.raw.data).to.eq("var test=1");
  });
});
