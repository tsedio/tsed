import {expect} from "chai";
import {Middleware, registerMiddleware} from "../../../../src/mvc";

describe("Middleware", () => {
  it("should use registerMiddleware", () => {
    expect(Middleware()).to.eq(registerMiddleware);
  });
});
