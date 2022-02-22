import {getConstructorArgNames} from "@tsed/core";

describe("getConstructorArgNames", () => {
  it("should return the constructor args names", () => {
    class Test {
      constructor(test: string) {}
    }

    expect(getConstructorArgNames(Test)).toEqual(["test"]);
  });
});
