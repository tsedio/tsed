import {ProviderRegistry} from "@tsed/common";
import {registerModel} from "../../../../src/mongoose/utils";
import {Sinon} from "../../../tools";

describe("registerModel()", () => {
    describe("when a class is given", () => {
        class Test {
        }

        before(() => {
            this.mergeStub = Sinon.stub(ProviderRegistry, "merge");

            registerModel(Test, {model: "model"});
        });

        after(() => {
            this.mergeStub.restore();
        });

        it("should call ProviderRegistry.merge()", () => {
            this.mergeStub.should.have.been.calledWithExactly(Test, {
                instance: {model: "model"},
                provide: Test,
                type: "factory",
                useClass: Test
            });
        });
    });

    describe("when a config is given", () => {
        class Test {
        }

        before(() => {
            this.mergeStub = Sinon.stub(ProviderRegistry, "merge");

            registerModel({provide: Test, instance: {model: "model"}});
        });

        after(() => {
            this.mergeStub.restore();
        });

        it("should call ProviderRegistry.merge()", () => {
            this.mergeStub.should.have.been.calledWithExactly(Test, {
                instance: {model: "model"},
                provide: Test,
                type: "factory",
                useClass: Test
            });
        });
    });

});