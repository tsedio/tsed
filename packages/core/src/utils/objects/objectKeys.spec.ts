import {objectKeys} from "./objectKeys";

describe("objectKeys", () => {
  it("should return only authorized keys", () => {
    const obj = JSON.parse('{"__proto__": {"a": "vulnerable"}, "test": "test"}');

    expect(objectKeys(obj)).toEqual(["test"]);
    expect(({} as any).a).toBeUndefined();
  });
});
