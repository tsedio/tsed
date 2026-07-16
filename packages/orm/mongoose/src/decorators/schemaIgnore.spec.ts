import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {SchemaIgnore} from "./schemaIgnore.js";
import {Store} from "@tsed/core";

describe("@SchemaIgnore()", () => {
  it("should set metadata", () => {
    class Test {
      @SchemaIgnore()
      test: any;
    }

    const store = Store.from(Test, "test");
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      schemaIgnore: true
    });
  });
});
