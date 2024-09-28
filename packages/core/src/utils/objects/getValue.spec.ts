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
});
