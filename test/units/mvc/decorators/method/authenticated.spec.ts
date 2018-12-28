import * as Proxyquire from "proxyquire";
import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {AuthenticatedMiddleware} from "../../../../../packages/common/src/mvc/components/AuthenticatedMiddleware";
import {expect, Sinon} from "../../../../tools";

const middleware: any = Sinon.stub();
// tslint:disable-next-line: variable-name
const UseBefore: any = Sinon.stub().returns(middleware);

const {Authenticated} = Proxyquire.load("../../../../../packages/common/src/mvc/decorators/method/authenticated", {
  "./useBefore": {UseBefore}
});

class Test {
  test() {}
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
    UseBefore.should.be.calledWithExactly(AuthenticatedMiddleware);
    middleware.should.be.calledWithExactly(Test, "test", descriptorOf(Test, "test"));
  });
});
