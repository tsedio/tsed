import {JsonSchema} from "../../../../src/common/jsonschema/class/JsonSchema";
import {MinItems} from "../../../../src/common/jsonschema/decorators/minItems";
import {stubSchemaDecorator} from "./utils";

describe("MinItems", () => {
    before(() => {
        this.decorateStub = stubSchemaDecorator();
        this.schema = new JsonSchema();
        try {
            MinItems(-10);
        } catch (er) {
            this.error = er;
        }
        MinItems(10);
        this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.schema.minItems.should.eq(10);
    });
    it("should throw an error when the given parameters is as negative integer", () => {
        this.error.message.should.deep.equal("The value of minItems MUST be a non-negative integer.");
    });
});