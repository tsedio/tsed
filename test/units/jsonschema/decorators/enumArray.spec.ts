import {EnumArray} from "../../../../src/jsonschema/decorators/enumArray";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("EnumArray", () => {
    before(() => {
        this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
        this.propertyMetadata = {
            schema: {}
        };
        EnumArray("enum1", "enum2");
        this.decorateStub.getCall(0).args[0](this.propertyMetadata);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.propertyMetadata.schema.type.should.eq("array");
        this.propertyMetadata.schema.items.enum.should.deep.eq(["enum1", "enum2"]);
    });
});