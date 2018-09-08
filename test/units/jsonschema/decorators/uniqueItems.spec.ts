import {JsonSchema} from "../../../../packages/common/src/jsonschema/class/JsonSchema";
import {UniqueItems} from "../../../../packages/common/src/jsonschema/decorators/uniqueItems";
import {stubSchemaDecorator} from "./utils";

describe("UniqueItems", () => {
  before(() => {
    this.decorateStub = stubSchemaDecorator();
    this.schema = new JsonSchema();
    UniqueItems(true);
    UniqueItems();
    this.decorateStub.getCall(0).args[0](this.schema);
  });
  after(() => {
    this.decorateStub.restore();
  });

  it("should store data", () => {
    this.schema.uniqueItems.should.be.eq(true);
  });
});
