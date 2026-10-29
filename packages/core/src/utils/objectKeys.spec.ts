import {objectKeys} from "./objectKeys.js";

describe("objectKeys", () => {
  it("should return only authorized keys", () => {
    const obj = JSON.parse('{"__proto__": {"a": "vulnerable"}, "test": "test"}');

    expect(objectKeys(obj)).toEqual(["test"]);
    expect(({} as any).a).toBeUndefined();
  });

  it("should return the own enumerable keys in order", () => {
    const obj = Object.create({inherited: 1});
    obj.b = 1;
    obj.a = 2;
    Object.defineProperty(obj, "hidden", {value: 3, enumerable: false});

    expect(objectKeys(obj)).toEqual(["b", "a"]);
  });

  it("should remove constructor and prototype keys", () => {
    expect(objectKeys({a: 1, constructor: 2, prototype: 3, b: 4})).toEqual(["a", "b"]);
  });

  it("should return a new array", () => {
    const obj = {a: 1};

    objectKeys(obj).push("b");

    expect(objectKeys(obj)).toEqual(["a"]);
  });
});
