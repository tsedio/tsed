import {ExclusiveMinimum} from "../../../../src/ajv/decorators/exclusiveMinimum";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("ExclusiveMinimum", () => {
    describe("without explicit parameter", () => {

        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            ExclusiveMinimum(10, true);
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.exclusiveMinimum.should.eq(true);
            this.propertyMetadata.schema.minimum.should.eq(10);
        });
    });
    describe("without explicit parameter", () => {
        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            ExclusiveMinimum(10);
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.exclusiveMinimum.should.eq(true);
            this.propertyMetadata.schema.minimum.should.eq(10);
        });

    });
});