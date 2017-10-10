import {Metadata} from "../../../../src/core/class/Metadata";
import {ParamMetadata} from "../../../../src/mvc/class/ParamMetadata";
import {EXPRESS_NEXT_FN} from "../../../../src/mvc/constants/index";
import {ParamRegistry} from "../../../../src/mvc/registries/ParamRegistry";
import {expect, Sinon} from "../../../tools";

class Test {

}

describe("ParamRegistry", () => {

    describe("hasNextFunction()", () => {

        before(() => {
            this.getStub = Sinon.stub(Metadata, "get");
            this.getStub.returns([{service: EXPRESS_NEXT_FN}]);
            this.hasStub = Sinon.stub(Metadata, "has");
            this.hasStub.returns(true);
        });
        after(() => {
            this.getStub.restore();
            this.hasStub.restore();
        });
        it("should return true", () => {
            expect(ParamRegistry.hasNextFunction(Test, "test")).to.eq(true);
        });

    });

    describe("required()", () => {
        before(() => {
            ParamRegistry.required(Test, "test", 0, [null, ""]);
            this.paramMetadata = ParamRegistry.get(Test, "test", 0);
        });

        it("should return the paramMetadata", () => {
            expect(this.paramMetadata).to.be.an.instanceof(ParamMetadata);
        });
        it("should be required", () => {
            expect(this.paramMetadata.required).to.eq(true);
        });
        it("should be allowedValues", () => {
            expect(this.paramMetadata.allowedValues).to.deep.eq([null, ""]);
        });
    });
});