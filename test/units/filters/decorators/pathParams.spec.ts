import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {PathParamsFilter} from "../../../../src/filters/components/PathParamsFilter";

const ParamsRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {PathParams} = Proxyquire.load("../../../../src/filters/decorators/pathParams", {
    "../../mvc/registries/ParamsRegistry": {ParamsRegistry}
});

class Test {

}

describe("PathParams", () => {

    describe("as parameter decorator", () => {
        before(() => {
            this.options = ["test", Test];
            PathParams(...this.options)(Test, "test", 0);
            this.args = ParamsRegistry.useFilter.args[0];
        });

        it("should call registry method", () => {
            assert(ParamsRegistry.useFilter.called, "method not called");
        });

        it("should add metadata", () => {
            expect(this.args[0]).to.eq(PathParamsFilter);
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
            PathParams()(Test, "test", {});
        });

        it("should do nothing", () => {
            assert(!ParamsRegistry.useFilter.called, "method is called");
        });
    });

});
