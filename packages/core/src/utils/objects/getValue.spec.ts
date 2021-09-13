import {expect} from "chai";
import {getValue} from "../index";

describe("getValue()", () => {
  it("should return given value when expression is undefined", () => {
    expect(getValue(undefined, {})).to.deep.eq({});
    expect(getValue({}, undefined)).to.deep.eq({});
  });
  it("should return given value when expression is undefined 2", () => {
    expect(getValue(undefined, undefined)).to.deep.eq(undefined);
  });
  it("should return given undefined when expression is given but scope doesn't have value", () => {
    expect(getValue("user", {})).to.deep.eq(undefined);
    expect(getValue({}, "user")).to.deep.eq(undefined);
  });
  it("should return given value when expression is given and scope have value", () => {
    expect(getValue("user", {user: "name"})).to.deep.eq("name");
    expect(getValue({user: "name"}, "user")).to.deep.eq("name");
  });
  it("should return given value when expression is given but scope have value (2)", () => {
    expect(getValue("user.name", {user: {name: "name"}})).to.deep.eq("name");
    expect(getValue({user: {name: "name"}}, "user.name")).to.deep.eq("name");
  });
  it("should return given value when expression is given but scope have value (3)", () => {
    expect(getValue("users.0", {users: [{user: {name: "name"}}]})).to.deep.eq({user: {name: "name"}});
    expect(getValue({users: [{user: {name: "name"}}]}, "users.0")).to.deep.eq({user: {name: "name"}});
  });
  it("should return given value when expression is given but scope have value (3)", () => {
    const map = new Map([["user", "name"]]);
    expect(getValue("user", map)).to.deep.eq("name");
    expect(getValue(map, "user")).to.deep.eq("name");
  });
  it("should return from an object with get method", () => {
    const map = {
      get() {
        return "name";
      }
    };
    expect(getValue("user", map)).to.deep.eq("name");
    expect(getValue(map, "user")).to.deep.eq("name");
  });
  it("should return undefined", () => {
    expect(getValue("user", undefined)).to.deep.eq(undefined);
    expect(getValue(undefined, "user")).to.deep.eq(undefined);
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
    ).to.deep.eq(undefined);
  });
});
