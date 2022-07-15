import {PlatformTest} from "@tsed/common";
import {PlatformExpressResponse} from "@tsed/platform-express";
import "./PlatformExpressResponse";

describe("PlatformExpressResponse", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a PlatformResponse instance", () => {
    const response = PlatformTest.createResponse();
    const ctx = PlatformTest.createRequestContext({
      event: {
        response
      },
      ResponseKlass: PlatformExpressResponse
    });

    expect(ctx.response.raw).toEqual(response);
  });
});
