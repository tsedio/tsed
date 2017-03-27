import {expect, Sinon} from "../../../tools";
import * as Proxyquire from "proxyquire";
import {EXPRESS_NEXT_FN} from "../../../../src/mvc/constants/index";

class Test {

}

const Metadata = {
    get: Sinon.stub().returns([{service: EXPRESS_NEXT_FN}]),
    has: Sinon.stub().returns(true)
};

const {ParamsRegistry} = Proxyquire("../../../../src/mvc/registries/ParamsRegistry", {
    "../../core/class/Metadata": {
        Metadata
    }
});

// const ParamsRegistry = Proxyquire()

describe("ParamsRegistry", () => {

    describe("hasNextFunction()", () => {

        it("should return true", () => {
            expect(ParamsRegistry.hasNextFunction(Test, "test")).to.eq(true);
        });

    });
});