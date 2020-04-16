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
    obj.method.should.not.eq(originalMethod);
    cbStub.should.be.calledOnce.and.calledWithExactly("arg", "arg2");
    originalMethod.should.be.calledOnce.and.calledWithExactly("arg", "arg2");
    result.should.be.eq("returns");
  });
});
