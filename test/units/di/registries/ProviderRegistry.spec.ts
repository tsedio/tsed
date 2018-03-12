import {ProviderRegistry, registerFactory, registerService} from "@tsed/common";
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

                registerFactory({provide: Test, instance: {factory: "factory"}});
            });

            after(() => {
                this.mergeStub.restore();
            });

            it("should call ProviderRegistry.merge()", () => {
                this.mergeStub.should.have.been.calledWithExactly(Test, {
                    instance: {factory: "factory"},
                    provide: Test,
                    type: "factory",
                    useClass: Test
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
                    type: "service",
                    useClass: Test
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
                    type: "service",
                    useClass: Test
                });
            });
        });

    });
});