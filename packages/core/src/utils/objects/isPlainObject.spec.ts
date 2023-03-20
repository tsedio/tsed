import {isPlainObject} from "./isPlainObject";

describe("isPlainObject", () => {
  it("should test if the value is a plain object", () => {
    expect(isPlainObject({})).toEqual(true);
    expect(isPlainObject(class {})).toEqual(false);
    expect(isPlainObject(new (class {})())).toEqual(false);
    expect(isPlainObject(Object)).toEqual(false);
  });
});
