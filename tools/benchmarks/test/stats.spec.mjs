import {describe, expect, it} from "vitest";

import {formatGap} from "../src/report.mjs";
import {compare, median, pairedRatios, summarizeRatios} from "../src/stats.mjs";

describe("stats", () => {
  describe("summarizeRatios()", () => {
    it("should report a significant gain", () => {
      const summary = summarizeRatios([1.04, 1.05, 1.06, 1.05, 1.05]);

      expect(summary.ratio).toBeCloseTo(1.05, 2);
      expect(summary.low).toBeGreaterThan(1.03);
      expect(summary.high).toBeLessThan(1.07);
      expect(summary.significant).toBe(true);
      expect(formatGap(summary)).toMatch(/^\*\*\+5\.0%\*\* \[\+\d\.\d; \+\d\.\d\] better$/);
    });

    it("should report a gap inside the noise as not significant", () => {
      const summary = summarizeRatios([0.97, 1.04, 1.01, 0.99, 1.03]);

      expect(summary.low).toBeLessThan(1);
      expect(summary.high).toBeGreaterThan(1);
      expect(summary.significant).toBe(false);
      expect(formatGap(summary)).toMatch(/not significant$/);
    });

    it("should report a significant regression", () => {
      const summary = summarizeRatios([0.9, 0.91, 0.89, 0.9]);

      expect(summary.significant).toBe(true);
      expect(formatGap(summary)).toMatch(/^\*\*-10\.0%\*\* .* worse$/);
    });

    it("should not give an interval for a single round", () => {
      expect(summarizeRatios([1.1])).toMatchObject({n: 1, significant: false});
      expect(formatGap(summarizeRatios([1.1]))).toBe("+10.0% (1 round)");
    });

    it("should ignore missing rounds", () => {
      expect(summarizeRatios([])).toBeNull();
      expect(formatGap(null)).toBe("–");
    });
  });

  describe("pairedRatios()", () => {
    it("should divide each round by the same round of the baseline", () => {
      expect(pairedRatios([110, 220], [100, 200])).toEqual([1.1, 1.1]);
    });

    it("should invert the ratio when a lower value is better (latency, CPU)", () => {
      // the target needs half the CPU of the baseline: twice as good
      expect(pairedRatios([5, 10], [10, 20], {higherIsBetter: false})).toEqual([2, 2]);
    });

    it("should skip a round missing on one side", () => {
      expect(pairedRatios([110, undefined, 330], [100, 200, 300])).toEqual([1.1, 1.1]);
    });
  });

  it("compare() should mark a lower CPU per request as better", () => {
    const summary = compare([50, 51, 49, 50, 50], [100, 100, 100, 100, 100], {higherIsBetter: false});

    expect(summary.ratio).toBeCloseTo(2, 1);
    expect(summary.significant).toBe(true);
  });

  it("median() should handle odd and even lengths", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(median([])).toBeNaN();
  });
});
