import {Store} from "@tsed/core";
import {Value} from "./value.js";
import {INJECTABLE_PROP} from "../constants/constants.js";

describe("@Value()", () => {
  it("should store metadata", () => {
    // GIVEN
    class Test {}

    // WHEN
    Value("expression")(Test, "test");

    // THEN
    expect(Store.from(Test).get(INJECTABLE_PROP)).toEqual({
      test: {
        bindingType: "value",
        propertyKey: "test",
        expression: "expression",
        defaultValue: undefined
      }
    });
  });
});
