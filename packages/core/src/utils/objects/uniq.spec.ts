import {uniq, uniqBy} from "./uniq.js";

describe("uniq", () => {
  it("should return uniq item", () => {
    expect(uniq(["test", "test1", "test"])).toEqual(["test", "test1"]);
    expect(uniqBy([{id: "test"}, {id: "test1"}, {id: "test"}], "id")).toEqual([{id: "test"}, {id: "test1"}]);
  });
});
