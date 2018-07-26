import * as Proxyquire from "proxyquire";
import {Store} from "../../../../../packages/core/src/class/Store";
import {AcceptMimesMiddleware} from "../../../../../packages/common/src/mvc/components/AcceptMimesMiddleware";
import {expect, Sinon} from "../../../../tools";

const middleware: any = Sinon.stub();
// tslint:disable-next-line: variable-name
const UseBefore: any = Sinon.stub().returns(middleware);

const {AcceptMime} = Proxyquire.load("../../../../../packages/common/src/mvc/decorators/method/acceptMime", {
  "./useBefore": {UseBefore}
});

class Test {}

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
    UseBefore.should.be.calledWith(AcceptMimesMiddleware);
    middleware.should.be.calledWith(Test, "test", this.descriptor);
  });
});
