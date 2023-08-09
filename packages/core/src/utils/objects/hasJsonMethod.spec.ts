import {hasJsonMethod} from "./hasJsonMethod";

describe("hasJsonMethod", () => {
  it("should return true if object has toJSON method", () => {
    expect(hasJsonMethod({toJSON: () => {}})).toEqual(true);
  });

  it("should return false if object hasn't toJSON method", () => {
    expect(hasJsonMethod({})).toEqual(false);
  });
});
