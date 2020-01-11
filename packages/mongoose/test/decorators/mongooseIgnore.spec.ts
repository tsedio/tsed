import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {SchemaIgnore} from "../../src/decorators/schemaIgnore";

describe("@SchemaIgnore()", () => {
  class Test {}

  before(() => {
    SchemaIgnore()(Test, "test", descriptorOf(Test, "test"));
    this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
  });

  it("should set metadata", () => {
    expect(this.store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      schemaIgnore: true
    });
  });
});
