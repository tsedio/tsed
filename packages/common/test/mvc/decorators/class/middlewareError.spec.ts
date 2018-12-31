import {expect} from "chai";
import {MiddlewareError, registerMiddlewareError} from "../../../../src/mvc";

describe("MiddlewareError", () => {
  it("should use registerMiddlewareError", () => {
    expect(MiddlewareError()).to.eq(registerMiddlewareError);
  });
});
