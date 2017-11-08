import {UniqueItems} from "../../../../src/ajv/decorators/uniqueItems";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("UniqueItems", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };
        UniqueItems(true);
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.uniqueItems.should.be.eq(true);
    });
});