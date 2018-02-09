import * as Proxyquire from "proxyquire";
import {Store} from "../../../../../src/core/class/Store";
import {ResponseViewMiddleware} from "../../../../../src/common/mvc/components/ResponseViewMiddleware";
import {expect, Sinon} from "../../../../tools";

const middleware: any = Sinon.stub();
const UseAfter: any = Sinon.stub().returns(middleware);
const {ResponseView} = Proxyquire.load("../../../../../src/common/mvc/decorators/method/responseView", {
    "./useAfter": {UseAfter}
});

class Test {

}

describe("ResponseView", () => {

    before(() => {
        this.descriptor = {};
        this.options = ["page", {}];
        ResponseView(...this.options)(Test, "test", this.descriptor);
        this.store = Store.from(Test, "test", this.descriptor);
    });

    after(() => {
        delete this.descriptor;
        delete this.options;
    });

    it("should set metadata", () => {
        expect(this.store.get(ResponseViewMiddleware)).to.deep.eq({
            viewPath: this.options[0],
            viewOptions: this.options[1]
        });
    });

    it("should create middleware", () => {
        UseAfter.should.be.calledWith(ResponseViewMiddleware);
        middleware.should.be.calledWith(Test, "test", this.descriptor);
    });
});