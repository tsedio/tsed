import {expect} from "chai";
import {MiddlewareError, registerMiddleware} from "../../../../src/mvc";

describe("MiddlewareError", () => {
  it("should use registerMiddlewareError", () => {
    expect(MiddlewareError()).to.eq(registerMiddleware);
  });
});
