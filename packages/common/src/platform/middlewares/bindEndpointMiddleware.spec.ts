import {bindEndpointMiddleware, EndpointMetadata} from "@tsed/common";
import {expect} from "chai";
import {FakeRequest} from "../../../../../test/helper";

class Test {
  test() {}
}

describe("bindEndpointMiddleware", () => {
  it("should bind endpoint to the request", async () => {
    const endpoint = new EndpointMetadata({
      target: Test,
      propertyKey: "test"
    });

    const request: any = new FakeRequest();
    const response: any = new FakeRequest();

    await new Promise(resolve => {
      bindEndpointMiddleware(endpoint)(request, response, resolve);
    });

    expect(request.ctx.endpoint).to.equal(endpoint);
  });
});
