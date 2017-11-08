import {MaxItems} from "../../../../src/ajv/decorators/maxItems";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("MaxItems", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };
        try {
            MaxItems(-10);
        } catch (er) {
            this.error = er;
        }
        MaxItems(10);
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.maxItems.should.eq(10);
    });

    it("should throw an error when the given parameters is as negative integer", () => {
        this.error.message.should.deep.equal("The value of maxItems MUST be a non-negative integer.");
    });
});