import {PropertyRegistry} from "../../../../src/jsonschema/registries/PropertyRegistry";
import {Allow} from "../../../../src/mvc/decorators/allow";
import {Sinon} from "../../../tools";
import {ParamRegistry} from "../../../../src/filters/registries/ParamRegistry";


class Test {

}

describe("Allow", () => {
    describe("when decorators is used as property decorator", () => {
        before(() => {
            this.metadata = {};
            this.getStub = Sinon.stub(PropertyRegistry, "get").returns(this.metadata);
            this.setStub = Sinon.stub(PropertyRegistry, "set");

            Allow(null, "")(Test, "test");
        });
        after(() => {
            this.getStub.restore();
            this.setStub.restore();
        });

        it("should have been called PropertyRegistry.get() with the correct parameters", () => {
            this.getStub.should.be.calledWithExactly(Test, "test");
        });

        it("should have been called PropertyRegistry.set() with the correct parameters", () => {
            this.setStub.should.be.calledWithExactly(Test, "test", this.metadata);
        });

        it("should have been stored allowed value on propertyMetadata", () => {
            this.metadata.allowedRequiredValues.should.be.deep.eq([null, ""]);
        });
    });

    describe("when decorators is used as parameters decorator", () => {
        before(() => {
            this.metadata = {};
            this.getStub = Sinon.stub(ParamRegistry, "get").returns(this.metadata);
            this.setStub = Sinon.stub(ParamRegistry, "set");

            Allow(null, "")(Test, "test", 0);
        });
        after(() => {
            this.getStub.restore();
            this.setStub.restore();
        });

        it("should have been called ParamRegistry.get() with the correct parameters", () => {
            this.getStub.should.be.calledWithExactly(Test, "test", 0);
        });

        it("should have been called ParamRegistry.set() with the correct parameters", () => {
            this.setStub.should.be.calledWithExactly(Test, "test", 0, this.metadata);
        });

        it("should have been stored allowed value on propertyMetadata", () => {
            this.metadata.allowedRequiredValues.should.be.deep.eq([null, ""]);
        });
    });

});