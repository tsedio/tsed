import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {LocalsFilter} from "../../../../src/filters/components/LocalsFilter";

const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {Locals} = Proxyquire.load("../../../../src/filters/decorators/locals", {
    "../../mvc/registries/ParamRegistry": {ParamRegistry}
});

class Test {

}

describe("Locals", () => {

    describe("as parameter decorator", () => {
        before(() => {
            this.options = ["test", Test];
            Locals(...this.options)(Test, "test", 0);
            this.args = ParamRegistry.useFilter.args[0];
        });

        it("should call registry method", () => {
            assert(ParamRegistry.useFilter.called, "method not called");
        });

        it("should add metadata", () => {
            expect(this.args[0]).to.eq(LocalsFilter);
            expect(this.args[1]).to.be.an("object");
            expect(this.args[1].propertyKey).to.eq("test");
            expect(this.args[1].target).to.eq(Test);
            expect(this.args[1].parameterIndex).to.eq(0);
        });
        it("should set expression metadata", () => {
            expect(this.args[1].expression).to.eq(this.options[0]);
        });
        it("should set useConverter metadata", () => {
            expect(this.args[1].useConverter).to.eq(false);
        });
    });

    describe("as other decorator type", () => {
        before(() => {
            ParamRegistry.useFilter = Sinon.stub();
            Locals()(Test, "test", {});
        });

        it("should do nothing", () => {
            assert(!ParamRegistry.useFilter.called, "method is called");
        });
    });

});
