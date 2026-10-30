import {describe, expect, it} from "vitest";

import {buildSchedule} from "../src/schedule.mjs";

const UNITS = ["8.44.1/express", "8.44.12/express", "raw/express", "8.44.1/koa", "8.44.12/koa"];

describe("buildSchedule()", () => {
  it("should measure every unit once per round", () => {
    const schedule = buildSchedule(UNITS, 5, 42);

    expect(schedule).toHaveLength(5);

    for (const round of schedule) {
      expect([...round].sort()).toEqual([...UNITS].sort());
    }
  });

  it("should shuffle the order of the rounds", () => {
    const orders = new Set(buildSchedule(UNITS, 10, 42).map((round) => round.join()));

    expect(orders.size).toBeGreaterThan(1);
  });

  it("should give the same order for the same seed", () => {
    expect(buildSchedule(UNITS, 5, 7)).toEqual(buildSchedule(UNITS, 5, 7));
    expect(buildSchedule(UNITS, 5, 7)).not.toEqual(buildSchedule(UNITS, 5, 8));
  });

  it("should never measure a target in more consecutive measurements than a round holds", () => {
    const sequence = buildSchedule(["A", "B"], 5, 3).flat();
    let longest = 0;
    let current = 0;

    for (const [index, unit] of sequence.entries()) {
      current = unit === sequence[index - 1] ? current + 1 : 1;
      longest = Math.max(longest, current);
    }

    expect(longest).toBeLessThanOrEqual(2);
  });
});
