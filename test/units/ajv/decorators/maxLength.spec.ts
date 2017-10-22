import {MaxLength} from "../../../../src/ajv/decorators/maxLength";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("MaxLength", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };

        try {
            MaxLength(-10);
        } catch (er) {
            this.error = er;
        }

        MaxLength(10);
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.maxLength.should.eq(10);
    });
    it("should throw an error when the given parameters is as negative integer", () => {
        this.error.message.should.deep.equal("The value of maxLength MUST be a non-negative integer.");
    });
});