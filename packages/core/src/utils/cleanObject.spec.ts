import {cleanObject} from "./cleanObject.js";

describe("cleanObject", () => {
  it("should clean undefined value from object", () => {
    expect(
      cleanObject(
        {
          test: undefined,
          test2: false,
          test3: null,
          test4: "",
          ignored: "key"
        },
        ["ignored"]
      )
    ).toEqual({
      test2: false,
      test3: null,
      test4: ""
    });
  });

  describe("own keys", () => {
    it("should keep own enumerable keys in order and skip inherited and non-enumerable ones", () => {
      const obj = Object.create({inherited: 1});
      obj.b = 1;
      obj.a = null;
      Object.defineProperty(obj, "hidden", {value: 3, enumerable: false});

      const result = cleanObject(obj);

      expect(Object.keys(result)).toEqual(["b", "a"]);
      expect(result).toEqual({b: 1, a: null});
    });

    it("should remove protected keys and ignored keys", () => {
      const obj = JSON.parse('{"__proto__": {"polluted": true}, "constructor": 1, "a": 1, "b": 2}');

      expect(cleanObject(obj, ["b"])).toEqual({a: 1});
      expect(cleanObject(obj, [])).toEqual({a: 1, b: 2});
      expect(({} as any).polluted).toBeUndefined();
    });

    it("should read each getter once", () => {
      const get = vi.fn().mockReturnValue(1);
      const obj = {};
      Object.defineProperty(obj, "value", {get, enumerable: true});

      expect(cleanObject(obj)).toEqual({value: 1});
      expect(get).toHaveBeenCalledTimes(1);
    });

    it("should return a new object", () => {
      const obj = {a: 1};

      expect(cleanObject(obj)).not.toBe(obj);
    });
  });
});
