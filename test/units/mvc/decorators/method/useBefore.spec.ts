import {decoratorArgs, descriptorOf} from "../../../../../src/core/utils";
import {UseBefore} from "../../../../../src/common/mvc/decorators/method/useBefore";
import {ControllerRegistry} from "../../../../../src/common/mvc/registries/ControllerRegistry";
import {EndpointRegistry} from "../../../../../src/common/mvc/registries/EndpointRegistry";
import {expect, Sinon} from "../../../../tools";

class Test {
    test() {

    }
}

describe("UseBefore()", () => {

    describe("when the decorator is use on a method", () => {
        before(() => {
            this.endpointRegistryStub = Sinon.stub(EndpointRegistry, "useBefore");

            this.returns = UseBefore(function () {
            })(...decoratorArgs(Test, "test"));
        });

        after(() => {
            this.endpointRegistryStub.restore();
        });

        it("should add the middleware on the use stack", () => {
            this.endpointRegistryStub.should.be.calledWithExactly(Test, "test", [Sinon.match.func]);
        });

        it("should return a descriptor", () => {
            this.returns.should.be.deep.eq(descriptorOf(Test, "test"));
        });
    });

    describe("when the decorator is use on a class", () => {
        before(() => {
            this.controllerMergeStub = Sinon.stub(ControllerRegistry, "merge");

            this.returns = UseBefore(function () {
            })(Test);
        });

        after(() => {
            this.controllerMergeStub.restore();
        });

        it("should add the middleware on the use stack", () => {
            this.controllerMergeStub.should.be.calledWithExactly(Test, {
                middlewares: {
                    useBefore: [Sinon.match.func]
                }
            });
        });
        it("should return nothing", () => {
            expect(this.returns).to.eq(undefined);
        });
    });
});