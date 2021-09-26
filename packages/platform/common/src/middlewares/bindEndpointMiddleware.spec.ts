import {bindEndpointMiddleware, EndpointMetadata, PlatformTest} from "@tsed/common";
import {expect} from "chai";

class Test {
  test() {}
}

describe("bindEndpointMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should bind endpoint to the request", async () => {
    const endpoint = new EndpointMetadata({
      target: Test,
      propertyKey: "test"
    });

    const ctx = PlatformTest.createRequestContext({endpoint});

    bindEndpointMiddleware(endpoint)(ctx);

    expect(ctx.endpoint).to.equal(endpoint);
  });
});
