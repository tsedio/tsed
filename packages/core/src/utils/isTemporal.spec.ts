import {isTemporal} from "./isTemporal.js";

describe("isTemporal", () => {
  it("should return true for Temporal constructors", () => {
    expect(isTemporal(Temporal.Instant)).toBe(true);
    expect(isTemporal(Temporal.ZonedDateTime)).toBe(true);
    expect(isTemporal(Temporal.PlainDate)).toBe(true);
    expect(isTemporal(Temporal.PlainDateTime)).toBe(true);
    expect(isTemporal(Temporal.PlainTime)).toBe(true);
    expect(isTemporal(Temporal.PlainYearMonth)).toBe(true);
    expect(isTemporal(Temporal.PlainMonthDay)).toBe(true);
    expect(isTemporal(Temporal.Duration)).toBe(true);
  });

  it("should return true for Temporal instances", () => {
    expect(isTemporal(Temporal.Instant.from("2024-01-15T10:30:00Z"))).toBe(true);
    expect(isTemporal(Temporal.PlainDate.from("2024-01-15"))).toBe(true);
    expect(isTemporal(Temporal.Duration.from("PT1H"))).toBe(true);
  });

  it("should return false for non-Temporal values", () => {
    expect(isTemporal(Date)).toBe(false);
    expect(isTemporal(new Date())).toBe(false);
    expect(isTemporal(String)).toBe(false);
    expect(isTemporal(class Test {})).toBe(false);
    expect(isTemporal("2024-01-15")).toBe(false);
    expect(isTemporal(null)).toBe(false);
    expect(isTemporal(undefined)).toBe(false);
  });
});
