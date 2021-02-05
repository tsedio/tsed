import {isNil} from "@tsed/core";
import {expect} from "chai";

describe("isNil", () => {
  it("should return true", () => {
    expect(isNil(null)).to.eq(true);
    expect(isNil(undefined)).to.eq(true);
    expect(isNil(1)).to.eq(false);
    expect(isNil("")).to.eq(false);
  });
});
