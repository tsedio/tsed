import {toStringConstructor} from "./toStringConstructor";

describe("toStringConstructor", () => {
  it("should return the constructor signature (empty)", () => {
    class Test {}

    expect(toStringConstructor(Test)).toBe("constructor()");
  });
  it("should return the constructor signature", () => {
    class Test {
      constructor(test: string) {
        console.log("test");
      }
    }

    expect(toStringConstructor(Test)).toBe("constructor(test)");
  });
});
