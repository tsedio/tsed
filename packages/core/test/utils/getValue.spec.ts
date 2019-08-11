import {expect} from "chai";
import {getValue} from "../../src/utils";

describe("getValue()", () => {
  it("should return given value when expression is undefined", () => {
    expect(getValue(undefined, {})).to.deep.eq({});
  });
  it("should return given undefined when expression is given but scope doesn\'t have value", () => {
    expect(getValue("user", {})).to.deep.eq(undefined);
  });
  it("should return given value when expression is given and scope have value", () => {
    expect(getValue("user", {user: "name"})).to.deep.eq("name");
  });
  it("should return given vlaue when expression is given but scope have value (2)", () => {
    expect(getValue("user.name", {user: {name: "name"}})).to.deep.eq("name");
  });
  it("should return given value when expression is given but scope have value (3)", () => {
    expect(getValue("users.0", {users: [{user: {name: "name"}}]})).to.deep.eq({user: {name: "name"}});
  });
  it("should return given value when expression is given but scope have value (3)", () => {
    const map = new Map([["user", "name"]]);
    expect(getValue("user", map)).to.deep.eq("name");
  });
});
