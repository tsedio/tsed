import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {EXPRESS_REQUEST} from "../../../../../src/mvc/constants/index";

const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};

const {Request} = Proxyquire.load("../../../../../src/mvc/decorators/param/request", {
    "../../registries/ParamRegistry": {ParamRegistry}
});

class Test {

}

describe("Request", () => {

    describe("as parameter decorator", () => {
        before(() => {
            Request()(Test, "test", 0);
            this.args = ParamRegistry.useService.args[0];
        });

        it("should call registry method", () => {
            assert(ParamRegistry.useService.called, "method not called");
        });

        it("should add metadata", () => {
            expect(this.args[0]).to.eq(EXPRESS_REQUEST);
            expect(this.args[1]).to.be.an("object");
            expect(this.args[1].propertyKey).to.eq("test");
            expect(this.args[1].target).to.eq(Test);
            expect(this.args[1].parameterIndex).to.eq(0);
        });
    });

    describe("as other decorator type", () => {
        before(() => {
            ParamRegistry.useService = Sinon.stub();
            Request()(Test, "test", {});
        });

        it("should do nothing", () => {
            assert(!ParamRegistry.useService.called, "method is called");
        });
    });

});
