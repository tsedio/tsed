import {Default} from "../../../../src/ajv/decorators/default";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("Default", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };
        Default("defaultValue");
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.default.should.be.eq("defaultValue");
    });
});