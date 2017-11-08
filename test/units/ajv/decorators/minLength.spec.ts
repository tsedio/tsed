import {MinLength} from "../../../../src/ajv/decorators/minLength";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("MinLength", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };

        try {
            MinLength(-10);
        } catch (er) {
            this.error = er;
        }

        MinLength(10);
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.minLength.should.eq(10);
    });
    it("should throw an error when the given parameters is as negative integer", () => {
        this.error.message.should.deep.equal("The value of minLength MUST be a non-negative integer.");
    });
});