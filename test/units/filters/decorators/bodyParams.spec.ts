import {Sinon} from "../../../tools";
import * as Proxyquire from "proxyquire";
import {BodyParamsFilter} from "../../../../src/filters/components/BodyParamsFilter";

const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {BodyParams} = Proxyquire.load("../../../../src/filters/decorators/bodyParams", {
    "../../mvc/registries/ParamRegistry": {ParamRegistry}
});

class Test {

}

describe("BodyParams", () => {

    describe("as parameter decorator", () => {
        before(() => {
            this.options = ["test", Test];
            BodyParams(...this.options)(Test, "test", 0);
        });

        after(() => {
            ParamRegistry.useFilter.reset();
        });

        it("should call registry method", () =>
            ParamRegistry.useFilter.should.have.been.called
        );

        it("should add metadata", () => {
            ParamRegistry.useFilter.should.have.been.calledWithExactly(BodyParamsFilter, {
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
            BodyParams()(Test, "test", {});
        });

        it("should do nothing", () =>
            !ParamRegistry.useFilter.should.not.have.been.called
        );
    });

});
