import {Maximum} from "../../../../src/ajv/decorators/maximum";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("Maximum", () => {
    describe("when it used without exclusive value", () => {
        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            Maximum(10);
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.maximum.should.eq(10);
        });
    });
    describe("when it used with exclusive value", () => {
        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            Maximum(10, true);
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.maximum.should.eq(10);
        });
        it("should store exclusiveMaximum data", () => {
            this.propertyMetadata.schema.exclusiveMaximum.should.eq(true);
        });
    });
});