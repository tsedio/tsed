import {Sinon} from "../../../tools";
import * as Proxyquire from "proxyquire";
import {SessionFilter} from "../../../../src/filters/components/SessionFilter";

const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {Session} = Proxyquire.load("../../../../src/filters/decorators/session", {
    "../../mvc/registries/ParamRegistry": {ParamRegistry}
});

class Test {

}

describe("Session", () => {

    describe("as parameter decorator", () => {
        before(() => {
            this.options = ["test", Test];
            Session(...this.options)(Test, "test", 0);
        });

        after(() => {
            ParamRegistry.useFilter.reset();
        });

        it("should call registry method", () =>
            ParamRegistry.useFilter.should.have.been.called
        );

        it("should add metadata", () => {
            ParamRegistry.useFilter.should.have.been.calledWithExactly(SessionFilter, {
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
            Session()(Test, "test", {});
        });

        it("should do nothing", () =>
            !ParamRegistry.useFilter.should.not.have.been.called
        );
    });

});
