import {MiddlewareError, registerMiddlewareError} from "@tsed/common";
import {expect} from "chai";

describe("MiddlewareError", () => {
  it("should use registerMiddlewareError", () => {
    expect(MiddlewareError()).to.eq(registerMiddlewareError);
  });
});
