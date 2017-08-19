import * as Proxyquire from "proxyquire";
import {EndpointRegistry} from "../../../../src/mvc/registries/EndpointRegistry";
import {expect, Sinon} from "../../../tools";

const ParamRegistry: any = {
    required: Sinon.stub()
};


const PropertyRegistry: any = {
    required: Sinon.stub()
};


class Test {

}


const {Required} = Proxyquire.load("../../../../src/mvc/decorators/required", {
    "../registries/ParamRegistry": {ParamRegistry},
    "../../converters/registries/PropertyRegistry": {PropertyRegistry}
});

describe("Required", () => {
    describe("is all case", () => {
        before(() => {
            Required()(Test, "test", 0);
            this.store = EndpointRegistry.store(Test, "test");
        });

        after(() => {
            ParamRegistry.required.reset();
            this.store.clear();
        });

        it("should set metadata", () => {
            expect(this.store.get("responses")).to.deep.eq({"400": {description: "Bad request"}});
        });
    });

    describe("when decorator is used as param", () => {
        before(() => {
            Required()(Test, "test", 0);
        });

        after(() => {
            ParamRegistry.required.reset();
        });

        it("should set metadata", () => {
            expect(this.store.get("responses")).to.deep.eq({"400": {description: "Bad request"}});
        });

        it("should called with the correct parameters", () => {
            ParamRegistry.required.should.have.been.calledWithExactly(Test, "test", 0);
        });
    });

    describe("when decorator is used as property", () => {
        before(() => {
            Required()(Test, "test");
        });

        after(() => {
            PropertyRegistry.required.reset();
        });

        it("should called with the correct parameters", () => {
            PropertyRegistry.required.should.have.been.calledWithExactly(Test, "test");
        });
    });
});