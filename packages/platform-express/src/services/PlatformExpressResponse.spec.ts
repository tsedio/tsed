import {PlatformResponse, PlatformTest} from "@tsed/common";
import {PlatformExpressResponse} from "@tsed/platform-express";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeResponse} from "../../../../test/helper";
import "./PlatformExpressResponse";

const sandbox = Sinon.createSandbox();

function createResponse() {
  const res: any = new FakeResponse(sandbox);
  const response = new PlatformExpressResponse(res);

  return {res, response};
}

describe("PlatformExpressResponse", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformResponse instance", () => {
    const {res, response} = createResponse();

    expect(response.raw).to.eq(res);
  });
});
