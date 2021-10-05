import {isSerializable} from "@tsed/core";
import {expect} from "chai";

describe("isSerializable()", () => {
  it("should return the expected value", () => {
    expect(isSerializable(true)).to.equal(false);
    expect(isSerializable(null)).to.equal(false);
    expect(isSerializable(undefined)).to.equal(false);
    expect(isSerializable("")).to.equal(false);
    expect(isSerializable("test")).to.equal(false);
    expect(isSerializable(0)).to.equal(false);
    expect(isSerializable(1)).to.equal(false);
    expect(isSerializable({})).to.equal(true);
  });
});
