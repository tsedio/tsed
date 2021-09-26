import {isRedirectionStatus, isSuccessStatus} from "@tsed/schema";
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

describe("isRedirectionStatus", () => {
  it("should return the expected value for ", () => {
    expect(isRedirectionStatus("300")).to.eq(true);
    expect(isRedirectionStatus(301)).to.eq(true);
    expect(isRedirectionStatus(200)).to.eq(false);
    expect(isRedirectionStatus(400)).to.eq(false);
  });
});
