import {Enumerable} from "../../decorators/enumerable.js";
import {getEnumerableKeys} from "./getEnumerableKeys.js";

describe("getEnumerableKeys", () => {
  it("should return enumerable keys", () => {
    class Test {
      @Enumerable(true)
      test: string;

      @Enumerable(false)
      test2: string;

      constructor() {
        this.test = "test";
        this.test2 = "test2";
      }
    }

    expect(getEnumerableKeys(new Test())).toEqual(["test"]);
  });
  it("should return enumerable keys (security test)", () => {
    const obj = JSON.parse('{"__proto__": {"a": "vulnerable"}, "test": "test"}');

    expect(getEnumerableKeys(obj)).toEqual(["test"]);
    expect(({} as any).a).toBeUndefined();
  });
});
