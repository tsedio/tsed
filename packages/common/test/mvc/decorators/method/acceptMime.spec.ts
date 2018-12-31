import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {AcceptMimesMiddleware} from "../../../../src/mvc";

const middleware: any = Sinon.stub();
const useBeforeStub: any = Sinon.stub().returns(middleware);

const {AcceptMime} = Proxyquire.load("../../../../src/mvc/decorators/method/acceptMime", {
  "./useBefore": {UseBefore: useBeforeStub}
});

class Test {
}

describe("AcceptMime", () => {
  before(() => {
    this.descriptor = {};
    this.options = "application/json";
    AcceptMime("application/json")(Test, "test", this.descriptor);
    this.store = Store.from(Test, "test", this.descriptor);
  });

  after(() => {
    delete this.descriptor;
    delete this.options;
  });

  it("should set metadata", () => {
    expect(this.store.get(AcceptMimesMiddleware)).to.deep.eq([this.options]);
  });

  it("should create middleware", () => {
    useBeforeStub.should.be.calledWith(AcceptMimesMiddleware);
    middleware.should.be.calledWith(Test, "test", this.descriptor);
  });
});
