import {Store} from "@tsed/core";
import {expect} from "chai";
import {Value} from "../../src";

class Test {}

describe("@Value()", () => {
  before(() => {
    Value("expression")(Test, "test");
    this.store = Store.from(Test).get("injectableProperties");
  });

  it("should store metadata", () => {
    expect(this.store).to.deep.eq({
      test: {
        bindingType: "value",
        propertyKey: "test",
        expression: "expression",
        defaultValue: undefined
      }
    });
  });
});
