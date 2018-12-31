import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {ResponseViewMiddleware} from "../../../../src/mvc";

const middleware: any = Sinon.stub();
const useAfterStub: any = Sinon.stub().returns(middleware);
const {ResponseView} = Proxyquire.load("../../../../src/mvc/decorators/method/responseView", {
  "./useAfter": {UseAfter: useAfterStub}
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
    useAfterStub.should.be.calledWith(ResponseViewMiddleware);
    middleware.should.be.calledWith(Test, "test", this.descriptor);
  });
});
