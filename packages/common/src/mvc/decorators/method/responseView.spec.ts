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

class Test {}

describe("ResponseView", () => {
  it("should set metadata", () => {
    const descriptor = {};
    const options = ["page", {}];
    ResponseView(...options)(Test, "test", descriptor);
    const store = Store.from(Test, "test", descriptor);
    expect(store.get(ResponseViewMiddleware)).to.deep.eq({
      viewPath: options[0],
      viewOptions: options[1]
    });
    useAfterStub.should.be.calledWith(ResponseViewMiddleware);
    middleware.should.be.calledWith(Test, "test", descriptor);
  });
});
