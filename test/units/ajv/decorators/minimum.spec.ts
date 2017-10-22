import {Minimum} from "../../../../src/ajv/decorators/minimum";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("Minimum", () => {
    describe("when it used without exclusive value", () => {
        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            Minimum(10);
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.minimum.should.eq(10);
        });
    });
    describe("when it used with exclusive value", () => {
        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            Minimum(10, true);
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.minimum.should.eq(10);
        });
        it("should store exclusiveMinimum data", () => {
            this.propertyMetadata.schema.exclusiveMinimum.should.eq(true);
        });
    });
});