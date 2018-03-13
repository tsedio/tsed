import {ProviderRegistry, registerFactory, registerProvider, registerService} from "@tsed/common";
import {Sinon} from "../../../tools";

describe("ProvideRegisry", () => {
    describe("registerFactory()", () => {
        describe("when a class is given", () => {
            class Test {
            }

            before(() => {
                this.mergeStub = Sinon.stub(ProviderRegistry, "merge");

                registerFactory(Test, {factory: "factory"});
            });

            after(() => {
                this.mergeStub.restore();
            });

            it("should call ProviderRegistry.merge()", () => {
                this.mergeStub.should.have.been.calledWithExactly(Test, {
                    instance: {factory: "factory"},
                    provide: Test,
                    type: "factory"
                });
            });
        });

        describe("when a config is given", () => {
            class Test {
            }

            before(() => {
                this.mergeStub = Sinon.stub(ProviderRegistry, "merge");

                registerFactory({provide: Test, instance: {factory: "factory"}});
            });

            after(() => {
                this.mergeStub.restore();
            });

            it("should call ProviderRegistry.merge()", () => {
                this.mergeStub.should.have.been.calledWithExactly(Test, {
                    instance: {factory: "factory"},
                    provide: Test,
                    type: "factory"
                });
            });
        });

    });
    describe("registerService()", () => {
        describe("when a class is given", () => {
            class Test {
            }

            before(() => {
                this.mergeStub = Sinon.stub(ProviderRegistry, "merge");

                registerService(Test);
            });

            after(() => {
                this.mergeStub.restore();
            });

            it("should call ProviderRegistry.merge()", () => {
                this.mergeStub.should.have.been.calledWithExactly(Test, {
                    provide: Test,
                    type: "service"
                });
            });
        });

        describe("when a config is given", () => {
            class Test {
            }

            before(() => {
                this.mergeStub = Sinon.stub(ProviderRegistry, "merge");

                registerService({provide: Test});
            });

            after(() => {
                this.mergeStub.restore();
            });

            it("should call ProviderRegistry.merge()", () => {
                this.mergeStub.should.have.been.calledWithExactly(Test, {
                    provide: Test,
                    type: "service"
                });
            });
        });
    });

    describe("registerProvider()", () => {
        describe("when provide field is not given", () => {
            before(() => {
                this.mergeStub = Sinon.stub(ProviderRegistry, "merge");
                this.hasStub = Sinon.stub(ProviderRegistry, "has").returns(false);
                try {
                    registerProvider({provide: undefined});
                } catch (er) {
                    this.error = er;
                }
            });

            after(() => {
                this.hasStub.restore();
                this.mergeStub.restore();
            });

            it("should throw an error", () => {
                this.error.message.should.deep.eq("Provider.provide is required");
            });
        });

        describe("when a configuration is given", () => {
            class Test {
            }

            before(() => {
                this.mergeStub = Sinon.stub(ProviderRegistry, "merge");
                registerProvider({provide: Test});
            });

            after(() => {
                this.mergeStub.restore();
            });

            it("should call ProviderRegistry.merge()", () => {
                this.mergeStub.should.have.been.calledWithExactly(Test, {
                    provide: Test
                });
            });
        });
    });
});