import {Store} from "@tsed/core";
import {Constant} from "../../src";

class Test {
}

describe("@Constant()", () => {
  it("should store metadata", () => {
    // WHEN
    Constant("expression")(Test, "test");

    // THEN
    const store = Store.from(Test).get("injectableProperties");

    store.should.deep.eq({
      test: {
        bindingType: "constant",
        propertyKey: "test",
        expression: "expression",
        defaultValue: undefined
      }
    });
  });
});
