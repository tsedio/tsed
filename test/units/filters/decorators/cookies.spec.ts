import {Sinon} from "../../../tools";
import * as Proxyquire from "proxyquire";
import {CookiesFilter} from "../../../../src/filters/components/CookiesFilter";

const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {Cookies} = Proxyquire.load("../../../../src/filters/decorators/cookies", {
    "../../mvc/registries/ParamRegistry": {ParamRegistry}
});

class Test {

}

describe("Cookies", () => {

    describe("as parameter decorator", () => {
        before(() => {
            this.options = ["test", Test];
            Cookies(...this.options)(Test, "test", 0);
        });

        after(() => {
            ParamRegistry.useFilter.reset();
        });

        it("should call registry method", () =>
            ParamRegistry.useFilter.should.have.been.called
        );

        it("should add metadata", () => {
            ParamRegistry.useFilter.should.have.been.calledWithExactly(CookiesFilter, {
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
            Cookies()(Test, "test", {});
        });

        it("should do nothing", () => {
            !ParamRegistry.useFilter.should.not.have.been.called;
        });
    });

});
