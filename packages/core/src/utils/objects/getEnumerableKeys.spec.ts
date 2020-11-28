import {Enumerable, getEnumerableKeys} from "@tsed/core";
import {expect} from "chai";

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

    expect(getEnumerableKeys(new Test())).to.deep.eq(["test"]);
  });
  it("should return enumerable keys (security test)", () => {
    const obj = JSON.parse('{"__proto__": {"a": "vulnerable"}, "test": "test"}');

    expect(getEnumerableKeys(obj)).to.deep.eq(["test"]);
    expect(({} as any).a).to.eq(undefined);
  });
});
