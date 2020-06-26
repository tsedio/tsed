import {expect} from "chai";
import {Unauthorized} from "@tsed/exceptions";
import {FakeRequest} from "../../../../../test/helper";
import {AuthenticatedMiddleware, EndpointMetadata} from "../../../src/mvc";

describe("AuthenticatedMiddleware", () => {
  class Test {
    test() {}
  }

  it("when user is authenticated", () => {
    // GIVEN
    const request = new FakeRequest();
    const endpoint = new EndpointMetadata({target: Test, propertyKey: "test"});
    const middleware = new AuthenticatedMiddleware();

    endpoint.store.set(AuthenticatedMiddleware, {options: "options"});

    request.isAuthenticated.returns(true);
    // WHEN
    const result = middleware.use(request as any, endpoint);

    // THEN
    expect(request.isAuthenticated).to.have.been.calledWithExactly({options: "options"});
    expect(result).to.eq(undefined);
  });

  it("when user is not authenticated", () => {
    // GIVEN
    const request = new FakeRequest();
    const endpoint = new EndpointMetadata({target: Test, propertyKey: "test"});
    const middleware = new AuthenticatedMiddleware();

    endpoint.store.set(AuthenticatedMiddleware, {options: "options"});

    request.isAuthenticated.returns(false);

    // WHEN
    let actualError;
    try {
      middleware.use(request as any, endpoint);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(request.isAuthenticated).to.have.been.calledWithExactly({options: "options"});
    expect(actualError).to.be.instanceOf(Unauthorized);
  });
});
