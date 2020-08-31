import {deepMerge} from "@tsed/core";
import {expect} from "chai";

describe("deepMerge", () => {
  it("should deep merge object", () => {
    expect(deepMerge({test: 1, test2: 2}, {test: 1, test3: {test: 1}})).to.deep.eq({
      test: 1,
      test2: 2,
      test3: {
        test: 1
      }
    });
  });
});
