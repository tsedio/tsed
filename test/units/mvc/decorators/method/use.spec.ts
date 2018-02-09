import {decoratorArgs, descriptorOf} from "../../../../../src/core/utils";
import {Use} from "../../../../../src/common/mvc/decorators/method/use";
import {ControllerRegistry} from "../../../../../src/common/mvc/registries/ControllerRegistry";
import {EndpointRegistry} from "../../../../../src/common/mvc/registries/EndpointRegistry";
import {expect, Sinon} from "../../../../tools";

class Test {
    test() {

    }
}

describe("Use()", () => {

    describe("when the decorator is use on a method", () => {
        before(() => {
            this.endpointRegistryStub = Sinon.stub(EndpointRegistry, "use");

            this.returns = Use(function () {
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

            this.returns = Use(function () {
            })(Test);
        });

        after(() => {
            this.controllerMergeStub.restore();
        });

        it("should add the middleware on the use stack", () => {
            this.controllerMergeStub.should.be.calledWithExactly(Test, {
                middlewares: {
                    use: [Sinon.match.func]
                }
            });
        });
        it("should return nothing", () => {
            expect(this.returns).to.eq(undefined);
        });
    });
});