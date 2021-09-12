import {Store} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {SchemaIgnore} from "./schemaIgnore";

describe("@SchemaIgnore()", () => {
  it("should set metadata", () => {
    class Test {
      @SchemaIgnore()
      test: any;
    }

    const store = Store.from(Test, "test");
    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      schemaIgnore: true
    });
  });
});
