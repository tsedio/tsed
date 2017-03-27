import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {SessionFilter} from "../../../../src/filters/components/SessionFilter";

const ParamsRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {Session} = Proxyquire.load("../../../../src/filters/decorators/session", {
    "../../mvc/registries/ParamsRegistry": {ParamsRegistry}
});

class Test {

}

describe("Session", () => {

    describe("as parameter decorator", () => {
        before(() => {
            this.options = ["test", Test];
            Session(...this.options)(Test, "test", 0);
            this.args = ParamsRegistry.useFilter.args[0];
        });

        it("should call registry method", () => {
            assert(ParamsRegistry.useFilter.called, "method not called");
        });

        it("should add metadata", () => {
            expect(this.args[0]).to.eq(SessionFilter);
            expect(this.args[1]).to.be.an("object");
            expect(this.args[1].propertyKey).to.eq("test");
            expect(this.args[1].target).to.eq(Test);
            expect(this.args[1].parameterIndex).to.eq(0);
        });
        it("should set expression metadata", () => {
            expect(this.args[1].expression).to.eq(this.options[0]);
        });
        it("should set useType metadata", () => {
            expect(this.args[1].useType).to.eq(this.options[1]);
        });
    });

    describe("as other decorator type", () => {
        before(() => {
            ParamsRegistry.useFilter = Sinon.stub();
            Session()(Test, "test", {});
        });

        it("should do nothing", () => {
            assert(!ParamsRegistry.useFilter.called, "method is called");
        });
    });

});
