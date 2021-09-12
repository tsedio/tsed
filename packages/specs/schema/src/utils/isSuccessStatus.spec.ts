import {isSuccessStatus} from "@tsed/schema";
import {expect} from "chai";

describe("isSuccessStatus", () => {
  it("should be a valid success status", () => {
    expect(isSuccessStatus(200)).to.eq(true);
    expect(isSuccessStatus("200")).to.eq(true);
  });

  it("should not be a valid success status", () => {
    expect(isSuccessStatus("300")).to.eq(false);
    expect(isSuccessStatus(101)).to.eq(false);
  });
});
