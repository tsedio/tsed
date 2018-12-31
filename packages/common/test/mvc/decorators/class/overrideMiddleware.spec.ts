import {OverrideProvider} from "@tsed/di";
import {expect} from "chai";
import {OverrideMiddleware} from "../../../../src/mvc";

describe("OverrideMiddleware", () => {
  it("should use OverrideProvider", () => {
    expect(OverrideMiddleware).to.eq(OverrideProvider);
  });
});
