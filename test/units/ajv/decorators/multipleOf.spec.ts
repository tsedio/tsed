import {MultipleOf} from "../../../../src/ajv/decorators/multipleOf";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("MultipleOf", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };
        try {
            MultipleOf(0);
        } catch (er) {
            this.error = er;
        }
        MultipleOf(10);
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.multipleOf.should.eq(10);
    });

    it("should throw an error when the given parameters is as negative integer", () => {
        this.error.message.should.deep.equal("The value of multipleOf MUST be a number, strictly greater than 0.");
    });
});