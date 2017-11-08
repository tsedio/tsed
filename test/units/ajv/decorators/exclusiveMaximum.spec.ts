import {ExclusiveMaximum} from "../../../../src/ajv/decorators/exclusiveMaximum";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("ExclusiveMaximum", () => {
    describe("with explicit parameter", () => {
        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            ExclusiveMaximum(10, true);
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.exclusiveMaximum.should.eq(true);
            this.propertyMetadata.schema.maximum.should.eq(10);
        });
    });

    describe("without explicit parameter", () => {
        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            ExclusiveMaximum(10);
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.exclusiveMaximum.should.eq(true);
            this.propertyMetadata.schema.maximum.should.eq(10);
        });
    });
});