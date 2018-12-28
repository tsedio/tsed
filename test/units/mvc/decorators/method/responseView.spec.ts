import * as Proxyquire from "proxyquire";
import {Store} from "@tsed/core";
import {ResponseViewMiddleware} from "../../../../../packages/common/src/mvc/components/ResponseViewMiddleware";
import {expect, Sinon} from "../../../../tools";

const middleware: any = Sinon.stub();
// tslint:disable-next-line: variable-name
const UseAfter: any = Sinon.stub().returns(middleware);
const {ResponseView} = Proxyquire.load("../../../../../packages/common/src/mvc/decorators/method/responseView", {
  "./useAfter": {UseAfter}
});

class Test {}

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
