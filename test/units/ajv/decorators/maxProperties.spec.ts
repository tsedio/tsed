import {MaxProperties} from "../../../../src/ajv/decorators/maxProperties";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("MaxProperties", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };
        try {
            MaxProperties(-10);
        } catch (er) {
            this.error = er;
        }

        MaxProperties(10);
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.maxProperties.should.eq(10);
    });
    it("should throw an error when the given parameters is as negative integer", () => {
        this.error.message.should.deep.equal("The value of maxProperties MUST be a non-negative integer.");
    });
});