import {isEmpty} from "@tsed/core";
import {expect} from "chai";

describe("isEmpty", () => {
  it("should return true", () => {
    expect(isEmpty(null)).to.eq(true);
    expect(isEmpty(undefined)).to.eq(true);
    expect(isEmpty(1)).to.eq(false);
    expect(isEmpty("")).to.eq(true);
  });
});
