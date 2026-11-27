import {describe, expect, it} from "vitest";

import {parseCpuList, splitCpus} from "../src/run.mjs";

describe("pinning", () => {
  describe("parseCpuList()", () => {
    it("should parse ranges and single CPUs", () => {
      expect(parseCpuList("0-3,6")).toEqual([0, 1, 2, 3, 6]);
    });

    it("should parse a CPU set that does not start at 0", () => {
      expect(parseCpuList("4-7")).toEqual([4, 5, 6, 7]);
    });
  });

  describe("splitCpus()", () => {
    it("should put the server on the first allowed CPU and the runner on the others", () => {
      expect(splitCpus([4, 5, 6, 7])).toEqual({server: "4", runner: "5,6,7"});
    });

    it("should not pin with a single CPU", () => {
      expect(splitCpus([3])).toBeNull();
    });
  });
});
