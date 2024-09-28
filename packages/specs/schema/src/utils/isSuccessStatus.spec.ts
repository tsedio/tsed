import {isRedirectionStatus, isSuccessStatus} from "./isSuccessStatus.js";

describe("isSuccessStatus", () => {
  it("should be a valid success status", () => {
    expect(isSuccessStatus(200)).toBe(true);
    expect(isSuccessStatus("200")).toBe(true);
  });

  it("should not be a valid success status", () => {
    expect(isSuccessStatus("300")).toBe(false);
    expect(isSuccessStatus(101)).toBe(false);
  });
});

describe("isRedirectionStatus", () => {
  it("should return the expected value for", () => {
    expect(isRedirectionStatus("300")).toBe(true);
    expect(isRedirectionStatus(301)).toBe(true);
    expect(isRedirectionStatus(200)).toBe(false);
    expect(isRedirectionStatus(400)).toBe(false);
  });
});
