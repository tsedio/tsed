import {Store} from "@tsed/core";
import {expect} from "chai";
import {Constant} from "../../src";

class Test {}

describe("@Constant()", () => {
  before(() => {
    Constant("expression")(Test, "test");
    this.store = Store.from(Test).get("injectableProperties");
  });

  it("should store metadata", () => {
    expect(this.store).to.deep.eq({
      test: {
        bindingType: "constant",
        propertyKey: "test",
        expression: "expression",
        defaultValue: undefined
      }
    });
  });
});
