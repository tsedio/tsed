import {assert, expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";

const ControllerRegistryStub: any = {
    merge: Sinon.stub()
};
const {RouterSettings} = Proxyquire.load("../../../../../src/common/mvc/decorators/class/routerSettings", {
    "../../registries/ControllerRegistry": {ControllerRegistry: ControllerRegistryStub}
});

const {Strict} = Proxyquire.load("../../../../../src/common/mvc/decorators/class/strict", {
    "./routerSettings": {RouterSettings}
});

const {CaseSensitive} = Proxyquire.load("../../../../../src/common/mvc/decorators/class/caseSensitive", {
    "./routerSettings": {RouterSettings}
});

const {MergeParams} = Proxyquire.load("../../../../../src/common/mvc/decorators/class/mergeParams", {
    "./routerSettings": {RouterSettings}
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