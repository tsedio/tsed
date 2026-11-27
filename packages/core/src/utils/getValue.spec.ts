import {getValue} from "./getValue.js";

describe("getValue()", () => {
  it("should return given value when expression is undefined", () => {
    expect(getValue(undefined, {})).toEqual({});
    expect(getValue({}, undefined)).toEqual({});
  });
  it("should return given value when expression is undefined 2", () => {
    expect(getValue(undefined, undefined)).toEqual(undefined);
  });
  it("should return given undefined when expression is given but scope doesn't have value", () => {
    expect(getValue("user", {})).toEqual(undefined);
    expect(getValue({}, "user")).toEqual(undefined);
  });
  it("should return given value when expression is given and scope have value", () => {
    expect(getValue("user", {user: "name"})).toEqual("name");
    expect(getValue({user: "name"}, "user")).toEqual("name");
  });
  it("should return given value when expression is given but scope have value (2)", () => {
    expect(getValue("user.name", {user: {name: "name"}})).toEqual("name");
    expect(getValue({user: {name: "name"}}, "user.name")).toEqual("name");
  });
  it("should return given value when expression is given but scope have value (3)", () => {
    expect(getValue("users.0", {users: [{user: {name: "name"}}]})).toEqual({user: {name: "name"}});
    expect(getValue({users: [{user: {name: "name"}}]}, "users.0")).toEqual({user: {name: "name"}});
  });
  it("should return given value when expression is given but scope have value (4)", () => {
    const map = new Map([["user", "name"]]);
    expect(getValue("user", map)).toEqual("name");
    expect(getValue(map, "user")).toEqual("name");
  });
  it("should return from an object with get method", () => {
    const map = {
      get() {
        return "name";
      }
    };
    expect(getValue("user", map)).toEqual("name");
    expect(getValue(map, "user")).toEqual("name");
  });
  it("should return undefined", () => {
    expect(getValue("user", undefined)).toEqual(undefined);
    expect(getValue(undefined, "user")).toEqual(undefined);
  });

  it("should return undefined from getter", () => {
    expect(
      getValue(
        {
          get test() {
            return undefined;
          },

          get() {
            return "test";
          }
        },
        "test"
      )
    ).toEqual(undefined);
  });

  describe("path walking", () => {
    it("should stop on the first falsy value and return it", () => {
      expect(getValue({a: 0}, "a.b", "default")).toEqual(0);
      expect(getValue({a: ""}, "a.b", "default")).toEqual("");
      expect(getValue({a: false}, "a.b.c", "default")).toEqual(false);
      expect(getValue({a: null}, "a.b", "default")).toEqual(null);
    });

    it("should return the default value only for undefined", () => {
      expect(getValue({a: {b: undefined}}, "a.b", "default")).toEqual("default");
      expect(getValue({a: {}}, "a.b.c", "default")).toEqual("default");
      expect(getValue({a: {b: null}}, "a.b", "default")).toEqual(null);
    });

    it("should support a custom separator", () => {
      expect(getValue({a: {b: 1}}, "a/b", undefined, "/")).toEqual(1);
      expect(getValue({a: {b: 1}}, "a::b", undefined, "::")).toEqual(1);
      expect(getValue({"a.b": 1}, "a.b", undefined, "/")).toEqual(1);
    });

    it("should split on each char with an empty separator", () => {
      expect(getValue({a: {b: 1}}, "ab", undefined, "")).toEqual(1);
    });

    it("should keep empty keys", () => {
      expect(getValue({a: {"": {b: 1}}}, "a..b")).toEqual(1);
      expect(getValue({a: {"": 1}}, "a.")).toEqual(1);
    });

    it("should read nested maps and mix objects and maps", () => {
      const scope = new Map<string, any>([["a", new Map([["b", {c: 1}]])]]);

      expect(getValue(scope, "a.b.c")).toEqual(1);
    });

    it("should read keys of primitives", () => {
      expect(getValue({a: "abc"}, "a.length")).toEqual(3);
    });

    it("should use get() when an object has no own value for the key", () => {
      const scope = {
        get(key: string) {
          return key === "user" ? {name: "name"} : undefined;
        }
      };

      expect(getValue(scope, "user.name")).toEqual("name");
    });

    it("should not call get() when the key exists with an undefined value", () => {
      const get = vi.fn();

      expect(getValue({user: undefined, get}, "user", "default")).toEqual("default");
      expect(get).not.toHaveBeenCalled();
    });
  });

  describe("arguments order", () => {
    it("should take the scope second when it is null", () => {
      expect(getValue("user", null, "default")).toEqual("default");
    });

    it("should take the scope first when the first argument is an object", () => {
      expect(getValue({user: 1}, "user", "default")).toEqual(1);
    });

    it("should return the scope when the expression is empty", () => {
      const scope = {user: 1};

      expect(getValue(scope, "")).toBe(scope);
      expect(getValue("", scope)).toBe(scope);
    });
  });
});
