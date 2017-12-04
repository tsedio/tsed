import {Metadata} from "../../../../src/core/class/Metadata";
import {ParamMetadata} from "../../../../src/filters/class/ParamMetadata";
import {EXPRESS_NEXT_FN} from "../../../../src/filters/constants";
import {ParamRegistry} from "../../../../src/filters/registries/ParamRegistry";
import {expect, Sinon} from "../../../tools";

class Test {

}

describe("ParamRegistry", () => {

    describe("decorate()", () => {
        describe("when it used with filter", () => {
            before(() => {
                this.useServiceStub = Sinon.stub(ParamRegistry, "usePreHandler");
                this.useFilterStub = Sinon.stub(ParamRegistry, "useFilter");

                this.classT = class T {
                };
                this.classO = class O {
                };

                this.decorator = ParamRegistry.decorate(this.classT, {expression: "options"});
                this.decorator(this.classO, "test", 0);
            });
            after(() => {
                this.useServiceStub.restore();
                this.useFilterStub.restore();
            });
            it("should return a function", () => {
                expect(this.decorator).to.be.a("function");
            });
            it("should call the useFilter with the correct parameters", () => {
                this.useFilterStub.should.have.been.calledOnce.and.calledWithExactly(this.classT, {
                    expression: "options",
                    target: this.classO,
                    propertyKey: "test",
                    parameterIndex: 0
                });
            });
            it("should not call the usePreHandler", () => {
                return this.useServiceStub.should.not.be.called;
            });
        });
        describe("when it used with service", () => {
            before(() => {
                this.useServiceStub = Sinon.stub(ParamRegistry, "usePreHandler");
                this.useFilterStub = Sinon.stub(ParamRegistry, "useFilter");

                this.symbolT = Symbol("serviceT");
                this.classO = class O {
                };

                this.decorator = ParamRegistry.decorate(this.symbolT, {expression: "options"});
                this.decorator(this.classO, "test", 0);
            });
            after(() => {
                this.useServiceStub.restore();
                this.useFilterStub.restore();
            });
            it("should return a function", () => {
                expect(this.decorator).to.be.a("function");
            });
            it("should call the usePreHandler with the correct parameters", () => {
                this.useServiceStub.should.have.been.calledOnce.and.calledWithExactly(this.symbolT, {
                    expression: "options",
                    target: this.classO,
                    propertyKey: "test",
                    parameterIndex: 0
                });
            });
            it("should not call the useFilter", () => {
                return this.useFilterStub.should.not.be.called;
            });
        });

    });

    describe("hasNextFunction()", () => {

        before(() => {
            this.getStub = Sinon.stub(Metadata, "get");
            this.getStub.returns([{service: EXPRESS_NEXT_FN}]);
            this.hasStub = Sinon.stub(Metadata, "has");
            this.hasStub.returns(true);
        });
        after(() => {
            this.getStub.restore();
            this.hasStub.restore();
        });
        it("should return true", () => {
            expect(ParamRegistry.hasNextFunction(Test, "test")).to.eq(true);
        });

    });

    describe("required()", () => {
        before(() => {
            ParamRegistry.required(Test, "test", 0, [null, ""]);
            this.paramMetadata = ParamRegistry.get(Test, "test", 0);
        });

        it("should return the paramMetadata", () => {
            expect(this.paramMetadata).to.be.an.instanceof(ParamMetadata);
        });
        it("should be required", () => {
            expect(this.paramMetadata.required).to.eq(true);
        });
        it("should be allowedRequiredValues", () => {
            expect(this.paramMetadata.allowedRequiredValues).to.deep.eq([null, ""]);
        });
    });
});