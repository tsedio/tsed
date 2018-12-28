import * as Sinon from "sinon";
import {applyBefore} from "../../src";

describe("applyBefore", () => {
  before(() => {
    this.originalMethod = Sinon.stub();
    this.originalMethod.returns("returns");
    this.object = {
      method: this.originalMethod
    };
    this.cbStub = Sinon.stub();

    applyBefore(this.object, "method", this.cbStub);
    this.result = this.object.method("arg", "arg2");
  });

  it("should override the original method", () => {
    this.object.method.should.not.eq(this.originalMethod);
  });
  it("should have been called the callback", () => {
    this.cbStub.should.be.calledOnce.and.calledWithExactly("arg", "arg2");
  });
  it("should have been called the originalMethod", () => {
    this.originalMethod.should.be.calledOnce.and.calledWithExactly("arg", "arg2");
  });
  it("should return the value return by the originalMethod", () => {
    this.result.should.be.eq("returns");
  });
});
