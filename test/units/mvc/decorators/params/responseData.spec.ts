import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {RESPONSE_DATA} from "../../../../../src/mvc/constants/index";

const ParamsRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {ResponseData} = Proxyquire.load("../../../../../src/mvc/decorators/param/responseData", {
    "../../registries/ParamsRegistry": {ParamsRegistry}
});

class Test {

}

describe("ResponseData", () => {

    describe("as parameter decorator", () => {
        before(() => {
            ResponseData()(Test, "test", 0);
            this.args = ParamsRegistry.useService.args[0];
        });

        it("should call registry method", () => {
            assert(ParamsRegistry.useService.called, "method not called");
        });

        it("should add metadata", () => {
            expect(this.args[0]).to.eq(RESPONSE_DATA);
            expect(this.args[1]).to.be.an("object");
            expect(this.args[1].propertyKey).to.eq("test");
            expect(this.args[1].target).to.eq(Test);
            expect(this.args[1].parameterIndex).to.eq(0);
        });
    });

    describe("as other decorator type", () => {
        before(() => {
            ParamsRegistry.useService = Sinon.stub();
            ResponseData()(Test, "test", {});
        });

        it("should do nothing", () => {
            assert(!ParamsRegistry.useService.called, "method is called");
        });
    });

});
