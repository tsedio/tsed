import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";

const ControllerRegistryStub: any = {
    merge: Sinon.stub()
};

const Scope = Proxyquire.load("../../../../../src/mvc/decorators/class/scope", {
    "../../registries/ControllerRegistry": {ControllerRegistry: ControllerRegistryStub}
}).Scope;

class Test {

}

describe("Scope", () => {

    describe("per request", () => {
        before(() => {
            Scope("request")(Test);
        });

        after(() => {

        });

        it("should call merge method with an object", () => {
            assert(ControllerRegistryStub.merge.calledWith(Test), "parameters mismatch");
            expect(ControllerRegistryStub.merge.args[0][1].scope).to.eq("request");
        });
    });

    describe("no params", () => {
        before(() => {
            Scope()(Test);
        });

        after(() => {

        });

        it("should call merge method with an object", () => {
            assert(ControllerRegistryStub.merge.calledWith(Test), "parameters mismatch");
            expect(ControllerRegistryStub.merge.args[1][1].scope).to.eq("request");
        });
    });

});