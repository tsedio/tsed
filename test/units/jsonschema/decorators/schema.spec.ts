import {JsonSchema} from "../../../../packages/common/src/jsonschema/class/JsonSchema";
import {Schema} from "../../../../packages/common/src/jsonschema/decorators/schema";
import {stubSchemaDecorator} from "./utils";

describe("Schema()", () => {
  before(() => {
    this.decorateStub = stubSchemaDecorator();
    this.schema = new JsonSchema();
    Schema({description: "description"});
    this.decorateStub.getCall(0).args[0](this.schema);
  });
  after(() => {
    this.decorateStub.restore();
  });

  it("should store data", () => {
    this.schema.description.should.be.eq("description");
  });
});
