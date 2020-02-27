import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {SchemaIgnore} from "./schemaIgnore";

describe("@SchemaIgnore()", () => {
  class Test {}

  it("should set metadata", () => {
    SchemaIgnore()(Test, "test", descriptorOf(Test, "test"));
    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      schemaIgnore: true
    });
  });
});
