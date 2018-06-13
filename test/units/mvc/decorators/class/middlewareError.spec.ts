import {MiddlewareError, registerMiddlewareError} from "@tsed/common";
import {expect} from "../../../../tools";

describe("MiddlewareError", () => {
  it("should use registerMiddlewareError", () => {
    expect(MiddlewareError()).to.eq(registerMiddlewareError);
  });
});
