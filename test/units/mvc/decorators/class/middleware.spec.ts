import {Middleware, registerMiddleware} from "../../../../../src/common/mvc";
import {expect} from "../../../../tools";

describe("Middleware", () => {
  it("should use registerMiddleware", () => {
    expect(Middleware()).to.eq(registerMiddleware);
  });
});
