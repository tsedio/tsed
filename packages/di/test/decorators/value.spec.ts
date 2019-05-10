import {Store} from "@tsed/core";
import {Value} from "../../src";


describe("@Value()", () => {
  it("should store metadata", () => {
    // GIVEN
    class Test {
    }

    // WHEN
    Value("expression")(Test, "test");

    // THEN
    Store.from(Test).get("injectableProperties").should.deep.eq({
      test: {
        bindingType: "value",
        propertyKey: "test",
        expression: "expression",
        defaultValue: undefined
      }
    });
  });
});
