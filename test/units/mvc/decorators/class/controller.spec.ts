import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";

const ControllerRegistryStub: any = {
    merge: Sinon.stub()
};

const Controller = Proxyquire.load("../../../../../src/mvc/decorators/class/controller", {
    "../../registries/ControllerRegistry": {ControllerRegistry: ControllerRegistryStub}
}).Controller;

class Test {

}

describe("Controller", () => {

    describe("path(string) + dependencies", () => {
        before(() => {
            Controller("/test", [])(Test);
        });

        after(() => {

        });

        it("should call merge method with an object", () => {
            assert(ControllerRegistryStub.merge.calledWith(Test), "parameters mismatch");
            expect(ControllerRegistryStub.merge.args[0][1].path).to.eq("/test");
            expect(ControllerRegistryStub.merge.args[0][1].dependencies).to.be.an("array");
        });
    });

    describe("path(regexp) + dependencies", () => {
        before(() => {
            Controller(/test/, [])(Test);
        });
        after(() => {

        });
        it("should call merge method with an object", () => {
            assert(ControllerRegistryStub.merge.calledWith(Test), "parameters mismatch");
            expect(ControllerRegistryStub.merge.args[1][1].path).instanceof(RegExp);
        });
    });

    describe("path(array) + dependencies", () => {
        before(() => {
            Controller([/test/], [])(Test);
        });
        after(() => {

        });
        it("should call merge method with an object", () => {
            assert(ControllerRegistryStub.merge.calledWith(Test), "parameters mismatch");
            expect(ControllerRegistryStub.merge.args[2][1].path).be.an("array");
        });
    });

    describe("object settigns", () => {
        before(() => {
            Controller({path: /test/, dependencies: []})(Test);
        });
        after(() => {

        });
        it("should call merge method with an object", () => {
            assert(ControllerRegistryStub.merge.calledWith(Test), "parameters mismatch");
            expect(ControllerRegistryStub.merge.args[3][1]).to.be.an("object");
        });
    });

});