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

class Test {}

describe("AcceptMime", () => {
  it("should set metadata", () => {
    const descriptor = {};
    const options = "application/json";
    AcceptMime("application/json")(Test, "test", descriptor);
    const store = Store.from(Test, "test", descriptor);
    expect(store.get(AcceptMimesMiddleware)).to.deep.eq([options]);
    useBeforeStub.should.be.calledWith(AcceptMimesMiddleware);
    middleware.should.be.calledWith(Test, "test", descriptor);
  });
});
