import {Sinon} from "../../../tools";
import * as Proxyquire from "proxyquire";
import {HeaderParamsFilter} from "../../../../src/filters/components/HeaderParamsFilter";

const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {HeaderParams} = Proxyquire.load("../../../../src/filters/decorators/headerParams", {
    "../../mvc/registries/ParamRegistry": {ParamRegistry}
});

class Test {

}

describe("HeaderParams", () => {

    describe("as parameter decorator", () => {
        before(() => {
            this.options = ["test", Test];
            HeaderParams(...this.options)(Test, "test", 0);
        });

        after(() => {
            ParamRegistry.useFilter.reset();
        });

        it("should call registry method", () =>
            ParamRegistry.useFilter.should.have.been.called
        );

        it("should add metadata", () => {
            ParamRegistry.useFilter.should.have.been.calledWithExactly(HeaderParamsFilter, {
                target: Test,
                propertyKey: "test",
                parameterIndex: 0,
                expression: "test"
            });
        });
    });

    describe("as other decorator type", () => {
        before(() => {
            HeaderParams()(Test, "test", {});
        });

        it("should do nothing", () =>
            !ParamRegistry.useFilter.should.not.have.been.called
        );
    });

});
