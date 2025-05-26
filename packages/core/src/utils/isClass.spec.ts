import {isClass} from "./isClass.js";

describe("isClass", () => {
  it("should test if a value is a class", () => {
    expect(isClass(class Test {})).toEqual(true);
    expect(isClass(Date)).toEqual(false);
    expect(isClass(undefined)).toEqual(false);
    expect(isClass(Symbol("zertyuio"))).toEqual(false);
    expect(isClass(Number)).toEqual(false);
    expect(isClass(Promise)).toEqual(false);
    expect(isClass(Array)).toEqual(false);
    expect(isClass(Buffer)).toEqual(false);
    expect(isClass(() => {})).toEqual(false);
  });
});
