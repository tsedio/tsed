import {MinItems} from "../../../../src/ajv/decorators/minItems";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("MinItems", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };
        try {
            MinItems(-10);
        } catch (er) {
            this.error = er;
        }
        MinItems(10);
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.minItems.should.eq(10);
    });
    it("should throw an error when the given parameters is as negative integer", () => {
        this.error.message.should.deep.equal("The value of minItems MUST be a non-negative integer.");
    });
});