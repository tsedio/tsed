import * as Proxyquire from "proxyquire";
import {EXPRESS_NEXT_FN} from "../../../../src/mvc/constants/index";
import {expect, Sinon} from "../../../tools";

class Test {

}

const Metadata = {
    get: Sinon.stub().returns([{service: EXPRESS_NEXT_FN}]),
    has: Sinon.stub().returns(true)
};

const {ParamRegistry} = Proxyquire("../../../../src/mvc/registries/ParamRegistry", {
    "../../core/class/Metadata": {
        Metadata
    }
});

// const ParamRegistry = Proxyquire()

describe("ParamRegistry", () => {

    describe("hasNextFunction()", () => {

        it("should return true", () => {
            expect(ParamRegistry.hasNextFunction(Test, "test")).to.eq(true);
        });

    });
});