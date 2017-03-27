import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";

const ControllerRegistryStub: any = {
    merge: Sinon.stub()
};
const {RouterSettings, MergeParams, CaseSensitive, Strict} = Proxyquire.load("../../../../../src/mvc/decorators/class/routerSettings", {
    "../../registries/ControllerRegistry": {ControllerRegistry: ControllerRegistryStub}
});

class Test {

}

describe("RouterSettings", () => {
    describe("MergeParams", () => {

        before(() => {
            MergeParams(true)(Test);
        });

        after(() => {

        });

        it("should call merge method for mergeParams options", () => {
            assert(ControllerRegistryStub.merge.calledWith(Test), "parameters mismatch");
            expect(ControllerRegistryStub.merge.args[0][1].routerOptions.mergeParams).to.eq(true);
        });

    });

    describe("CaseSensitive", () => {

        before(() => {
            CaseSensitive(true)(Test);
        });

        after(() => {

        });

        it("should call merge method for caseSensitive options", () => {
            assert(ControllerRegistryStub.merge.calledWith(Test), "parameters mismatch");
            expect(ControllerRegistryStub.merge.args[1][1].routerOptions.caseSensitive).to.eq(true);
        });

    });

    describe("Strict", () => {

        before(() => {
            Strict(true)(Test);
        });

        after(() => {

        });

        it("should call merge method for strict options", () => {
            assert(ControllerRegistryStub.merge.calledWith(Test), "parameters mismatch");
            expect(ControllerRegistryStub.merge.args[2][1].routerOptions.strict).to.eq(true);
        });

    });

});