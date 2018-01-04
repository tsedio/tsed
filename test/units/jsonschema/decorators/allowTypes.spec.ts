import {AllowTypes} from "../../../../src/jsonschema/decorators/allowTypes";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("AllowTypes", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };
        AllowTypes("string", "number");
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.type.should.deep.eq(["string", "number"]);
    });
});