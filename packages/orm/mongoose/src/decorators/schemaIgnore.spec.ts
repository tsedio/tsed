import {Store} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../constants/constants";
import {SchemaIgnore} from "./schemaIgnore";

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
