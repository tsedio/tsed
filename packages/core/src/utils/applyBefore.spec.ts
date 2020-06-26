import {expect} from "chai";
import * as Sinon from "sinon";
import {applyBefore} from "../../src";

describe("applyBefore", () => {
  it("should override the original method", () => {
    const originalMethod = Sinon.stub();
    originalMethod.returns("returns");
    const obj = {
      method: originalMethod
    };
    const cbStub = Sinon.stub();

    applyBefore(obj, "method", cbStub);
    const result = obj.method("arg", "arg2");
    expect(obj.method).to.not.eq(originalMethod);
    expect(cbStub).to.have.been.calledOnce.and.calledWithExactly("arg", "arg2");
    expect(originalMethod).to.have.been.calledOnce.and.calledWithExactly("arg", "arg2");
    expect(result).to.eq("returns");
  });
});
