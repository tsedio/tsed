import {ConverterService} from "../../../../src/converters/services/ConverterService";
import {InjectorService} from "../../../../src/di/services/InjectorService";
import {FilterBuilder} from "../../../../src/filters/class/FilterBuilder";
import {EXPRESS_RESPONSE} from "../../../../src/filters/constants";
import {RequiredParamError} from "../../../../src/filters/errors/RequiredParamError";
import {FilterPreHandlers} from "../../../../src/filters/registries/FilterRegistry";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {ValidationService} from "../../../../src/filters/services/ValidationService";
import {expect, Sinon} from "../../../tools";

describe("FilterBuilder", () => {
    describe("build()", () => {
        before(() => {
            this.builder = new FilterBuilder();

            this.initStub = Sinon.stub(this.builder, "initFilter");
            this.initStub.returns("filter");

            this.requiredStub = Sinon.stub(FilterBuilder as any, "appendRequiredFilter");
            this.requiredStub.returns("filter2");

            this.converterStub = Sinon.stub(FilterBuilder as any, "appendConverterFilter");
            this.converterStub.returns("filter3");

            this.validationStub = Sinon.stub(FilterBuilder as any, "appendValidationFilter");
            this.validationStub.returns("filter4");

            this.result = this.builder.build("param");
        });
        after(() => {
            this.initStub.restore();
            this.requiredStub.restore();
            this.converterStub.restore();
            this.validationStub.restore();
        });

        it("should call initFilter", () => {
            this.initStub.should.have.been.calledWithExactly("param");
        });

        it("should call appendRequiredFilter", () => {
            this.requiredStub.should.have.been.calledWithExactly("filter", "param");
        });

        it("should call appendConverterFilter", () => {
            this.converterStub.should.have.been.calledWithExactly("filter2", "param");
        });

        it("should call appendValidationFilter", () => {
            this.validationStub.should.have.been.calledWithExactly("filter3", "param");
        });

        it("should return the filter", () => {
            expect(this.result).to.eq("filter4");
        });
    });
    describe("initFilter()", () => {
        describe("when filter is a symbol", () => {
            before(() => {
                this.result = (new FilterBuilder() as any).initFilter({service: EXPRESS_RESPONSE});
            });
            it("should return a function", () => {
                expect(this.result).to.eq(FilterPreHandlers.get(EXPRESS_RESPONSE));
            });
        });
        describe("when filter is a class", () => {
            before(() => {
                this.param = {
                    service: class {
                    },
                    expression: "expression"
                };
                this.filterServiceStub = {
                    invokeMethod: Sinon.stub().returns("filterValue")
                };
                this.injectorStub = Sinon.stub(InjectorService as any, "get");
                this.injectorStub.returns(this.filterServiceStub);

                this.filter = (new FilterBuilder() as any).initFilter(this.param);
                this.result = this.filter({request: "request", response: "response"});
            });

            after(() => {
                this.injectorStub.restore();
            });
            it("should call the injector", () => {
                this.injectorStub.should.be.calledWithExactly(FilterService);
            });
            it("should store param on the filter", () => {
                this.filter.param.should.eq(this.param);
            });
            it("should call invokeMethod", () => {
                this.filterServiceStub.invokeMethod.should.have.been.calledWithExactly(
                    this.param.service,
                    this.param.expression,
                    "request",
                    "response"
                );
            });
        });
    });
    describe("appendRequiredFilter()", () => {
        describe("when param is required", () => {
            describe("when required but empty", () => {
                before(() => {
                    this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
                    this.pipeStub.returns("filter2");
                    this.isValidRequiredValueStub = Sinon.stub().returns(false);

                    this.result = (FilterBuilder as any).appendRequiredFilter("filter", {
                        required: true,
                        name: "name",
                        expression: "expression",
                        isValidRequiredValue: this.isValidRequiredValueStub
                    });
                    try {
                        this.pipeStub.getCall(0).args[1]("value");
                    } catch (er) {
                        this.error = er;
                    }
                });
                after(() => {
                    this.pipeStub.restore();
                });
                it("should call pipe method", () => {
                    this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any);
                });
                it("should return a filter wrapped", () => {
                    expect(this.result).to.eq("filter2");
                });
                it("should called isValidRequiredValue", () => {
                    this.isValidRequiredValueStub.should.calledWithExactly("value");
                });
                it("should throw an error", () => {
                    expect(this.error).to.deep.eq(new RequiredParamError("name", "expression"));
                });
            });
            describe("when required but not empty", () => {
                before(() => {
                    this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
                    this.pipeStub.returns("filter2");
                    this.isValidRequiredValueStub = Sinon.stub().returns(true);

                    this.result = (FilterBuilder as any).appendRequiredFilter("filter", {
                        required: true,
                        name: "name",
                        expression: "expression",
                        isValidRequiredValue: this.isValidRequiredValueStub
                    });
                    this.result2 = this.pipeStub.getCall(0).args[1]("value");
                });
                after(() => {
                    this.pipeStub.restore();
                });
                it("should call pipe method", () => {
                    this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any);
                });
                it("should return a filter wrapped", () => {
                    expect(this.result).to.eq("filter2");
                });
                it("should called isValidRequiredValue", () => {
                    this.isValidRequiredValueStub.should.calledWithExactly("value");
                });
                it("should return a value", () => {
                    expect(this.result2).to.eq("value");
                });
            });
        });
        describe("when param isn't required", () => {
            before(() => {
                this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");

                this.result = (FilterBuilder as any).appendRequiredFilter("filter", {
                    required: false
                });
            });
            after(() => {
                this.pipeStub.restore();
            });
            it("should not have been called pipe method", () => {
                return this.pipeStub.should.not.be.called;
            });
            it("should return a filter wrapped", () => {
                expect(this.result).to.eq("filter");
            });
        });
    });
    describe("appendValidationFilter()", () => {
        describe("when use validation", () => {
            before(() => {
                this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
                this.pipeStub.returns("filter2");

                this.injectorStub = Sinon.stub(InjectorService as any, "get");
                this.injectorStub.returns({
                    validate: function () {
                    }
                });

                this.result = (FilterBuilder as any).appendValidationFilter("filter", {
                    useValidation: true,
                    type: "type",
                    collectionType: "collection"
                });
            });
            after(() => {
                this.injectorStub.restore();
                this.pipeStub.restore();
            });
            it("should call pipe method", () => {
                this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any, "type", "collection");
            });
            it("should call injector.get method", () => {
                this.injectorStub.should.be.calledWithExactly(ValidationService);
            });
            it("should return a filter wrapped", () => {
                expect(this.result).to.eq("filter2");
            });
        });
        describe("when didn't use validation", () => {
            before(() => {
                this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
                this.pipeStub.returns("filter2");

                this.injectorStub = Sinon.stub(InjectorService as any, "get");
                this.injectorStub.returns({
                    validate: function () {
                    }
                });

                this.result = (FilterBuilder as any).appendValidationFilter("filter", {
                    useValidation: false,
                    type: "type",
                    collectionType: "collection"
                });
            });
            after(() => {
                this.injectorStub.restore();
                this.pipeStub.restore();
            });
            it("should not have been called pipe method", () => {
                return this.pipeStub.should.not.be.called;
            });
            it("shouldn't have called injector.get method", () => {
                return this.injectorStub.should.not.be.called;
            });
            it("should return a filter wrapped", () => {
                expect(this.result).to.eq("filter");
            });
        });
    });
    describe("appendConverterFilter()", () => {
        describe("when use converter", () => {
            before(() => {
                this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
                this.pipeStub.returns("filter2");

                this.injectorStub = Sinon.stub(InjectorService as any, "get");
                this.injectorStub.returns({
                    deserialize: function () {
                    }
                });

                this.result = (FilterBuilder as any).appendConverterFilter("filter", {
                    useConverter: true,
                    type: "type",
                    collectionType: "collection"
                });
            });
            after(() => {
                this.injectorStub.restore();
                this.pipeStub.restore();
            });
            it("should call pipe method", () => {
                this.pipeStub.should.be.calledWithExactly("filter", Sinon.match.any, "type", "collection");
            });
            it("should call injector.get method", () => {
                this.injectorStub.should.be.calledWithExactly(ConverterService);
            });
            it("should return a filter wrapped", () => {
                expect(this.result).to.eq("filter2");
            });
        });
        describe("when didn't use converter", () => {
            before(() => {
                this.pipeStub = Sinon.stub(FilterBuilder as any, "pipe");
                this.pipeStub.returns("filter2");

                this.injectorStub = Sinon.stub(InjectorService as any, "get");
                this.injectorStub.returns({
                    deserialize: function () {
                    }
                });

                this.result = (FilterBuilder as any).appendConverterFilter("filter", {
                    useValidation: false,
                    type: "type",
                    collectionType: "collection"
                });
            });
            after(() => {
                this.injectorStub.restore();
                this.pipeStub.restore();
            });
            it("should not have been called pipe method", () => {
                return this.pipeStub.should.not.be.called;
            });
            it("shouldn't have called injector.get method", () => {
                return this.injectorStub.should.not.be.called;
            });
            it("should return a filter wrapped", () => {
                expect(this.result).to.eq("filter");
            });
        });

    });
    describe("pipe()", () => {
        before(() => {
            this.result = (FilterBuilder as any).pipe(
                (v: any) => `filter1(${v})`,
                (v: any, ...args: any[]) => `filter2(${v},${args.join(",")})`,
                "arg1",
                "arg2"
            );
        });
        it("should return a function", () => {
            this.result.should.be.a("function");
        });

        it("should return the result of pipe", () => {
            this.result("value").should.be.eq("filter2(filter1(value),arg1,arg2)");
        });
    });
});