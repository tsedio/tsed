import {Sinon} from "../../../tools";
import * as Proxyquire from "proxyquire";
import {QueryParamsFilter} from "../../../../src/filters/components/QueryParamsFilter";

const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {QueryParams} = Proxyquire.load("../../../../src/filters/decorators/queryParams", {
    "../../mvc/registries/ParamRegistry": {ParamRegistry}
});

class Test {

}

describe("QueryParams", () => {

    describe("as parameter decorator", () => {
        before(() => {
            this.options = ["test", Test];
            QueryParams(...this.options)(Test, "test", 0);
        });

        after(() => {
            ParamRegistry.useFilter.reset();
        });

        it("should call registry method", () =>
            ParamRegistry.useFilter.should.have.been.called
        );

        it("should add metadata", () => {
            ParamRegistry.useFilter.should.have.been.calledWithExactly(QueryParamsFilter, {
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
            QueryParams()(Test, "test", {});
        });

        it("should do nothing", () =>
            !ParamRegistry.useFilter.should.not.have.been.called
        );
    });

});
