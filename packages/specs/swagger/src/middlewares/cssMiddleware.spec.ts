import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Fs from "fs";
import Sinon from "sinon";
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
    const ctx = PlatformTest.createRequestContext();

    cssMiddleware("/path")(ctx);

    expect(ctx.response.raw.headers).to.deep.eq({
      "content-type": "text/css",
      "x-request-id": "id"
    });
    expect(ctx.response.raw.statusCode).to.deep.eq(200);
    expect(ctx.response.raw.data).to.deep.eq(".css{}");
  });
});
