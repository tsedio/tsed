import {Sinon} from "../../../tools";
import * as Proxyquire from "proxyquire";
import {PathParamsFilter} from "../../../../src/filters/components/PathParamsFilter";

const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {PathParams} = Proxyquire.load("../../../../src/filters/decorators/pathParams", {
    "../../mvc/registries/ParamRegistry": {ParamRegistry}
});

class Test {

}

describe("PathParams", () => {

    describe("as parameter decorator", () => {
        before(() => {
            this.options = ["test", Test];
            PathParams(...this.options)(Test, "test", 0);
        });

        after(() => {
            ParamRegistry.useFilter.reset();
        });

        it("should call registry method", () =>
            ParamRegistry.useFilter.should.have.been.called
        );

        it("should add metadata", () => {
            ParamRegistry.useFilter.should.have.been.calledWithExactly(PathParamsFilter, {
                target: Test,
                propertyKey: "test",
                parameterIndex: 0,
                expression: "test",
                useType: Test
            });
        });
    });

    describe("as other decorator type", () => {
        before(() => {
            PathParams()(Test, "test", {});
        });

        it("should do nothing", () =>
            !ParamRegistry.useFilter.should.not.have.been.called
        );
    });

});
