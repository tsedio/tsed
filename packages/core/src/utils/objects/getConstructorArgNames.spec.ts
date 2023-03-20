import {getConstructorArgNames} from "./getConstructorArgNames";

describe("getConstructorArgNames", () => {
  it("should return the constructor args names", () => {
    class Test {
      constructor(test: string) {}
    }

    expect(getConstructorArgNames(Test)).toEqual(["test"]);
  });
});
