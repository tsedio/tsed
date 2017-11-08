import {Pattern} from "../../../../src/ajv/decorators/pattern";
import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Sinon} from "../../../tools";

describe("Pattern", () => {
    describe("with string pattern", () => {
        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            Pattern("patternValue");
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.pattern.should.be.eq("patternValue");
        });
    });
    describe("with regexp pattern", () => {
        before(() => {
            this.decorateStub = Sinon.stub(PropertyRegistry, "decorate");
            this.propertyMetadata = {
                schema: {}
            };
            Pattern(/abc/);
            this.decorateStub.getCall(0).args[0](this.propertyMetadata);
        });
        after(() => {
            this.decorateStub.restore();
        });

        it("should store data", () => {
            this.propertyMetadata.schema.pattern.should.be.eq("abc");
        });
    });
});