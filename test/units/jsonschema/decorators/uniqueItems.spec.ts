import {JsonSchema} from "../../../../src/common/jsonschema/class/JsonSchema";
import {UniqueItems} from "../../../../src/common/jsonschema/decorators/uniqueItems";
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