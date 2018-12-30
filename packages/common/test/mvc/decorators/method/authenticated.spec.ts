import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {AuthenticatedMiddleware} from "../../../../src/mvc";

const middleware: any = Sinon.stub();
const useBeforeStub: any = Sinon.stub().returns(middleware);

const {Authenticated} = Proxyquire.load("../../../../src/mvc/decorators/method/authenticated", {
  "./useBefore": {UseBefore: useBeforeStub}
});

class Test {
  test() {
  }
}

describe("Authenticated", () => {
  before(() => {
    this.descriptor = {};
    this.options = {options: "options"};

    Authenticated(this.options)(Test, "test", descriptorOf(Test, "test"));
    this.store = Store.fromMethod(Test, "test");
  });

  after(() => {
    this.store.clear();
  });

  it("should set metadata", () => {
    expect(this.store.get(AuthenticatedMiddleware)).to.deep.eq(this.options);
  });

  it("should set responses metadata", () => {
    expect(this.store.get("responses")).to.deep.eq({"403": {description: "Forbidden"}});
  });

  it("should create middleware", () => {
    useBeforeStub.should.be.calledWithExactly(AuthenticatedMiddleware);
    middleware.should.be.calledWithExactly(Test, "test", descriptorOf(Test, "test"));
  });
});
