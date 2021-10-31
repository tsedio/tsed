import {rawBodyMiddleware} from "./rawBodyMiddleware";
import Sinon from "sinon";
import {expect} from "chai";
import bytes from "bytes";

describe("rawBodyMiddleware", () => {
  it("should get rawBody", () => {
    const request: any = {
      is: Sinon.stub().returns(true),
      get: Sinon.stub().withArgs("Content-Length").returns("56"),
      on(event: string, cb: any) {
        cb("test");
      }
    };

    const next = Sinon.stub();

    rawBodyMiddleware(request, {}, next);

    expect(next).to.have.been.calledWithExactly();
    expect(request.rawBody).to.equal("test");
  });
  it("should not get rawBody when size is over 100kb", () => {
    const request: any = {
      is: Sinon.stub().returns(true),
      get: Sinon.stub().withArgs("Content-Length").returns(bytes.parse("101kb")),
      on(event: string, cb: any) {
        cb("test");
      }
    };

    const next = Sinon.stub();

    rawBodyMiddleware(request, {}, next);

    expect(next).to.have.been.calledWithExactly();
    expect(request.rawBody).to.equal(undefined);
  });
  it("should not get rawBody when the content-type mismatch", () => {
    const request: any = {
      is: Sinon.stub().returns(false),
      get: Sinon.stub().withArgs("Content-Length").returns("56"),
      on(event: string, cb: any) {
        cb("test");
      }
    };

    const next = Sinon.stub();

    rawBodyMiddleware(request, {}, next);

    expect(next).to.have.been.calledWithExactly();
    expect(request.rawBody).to.equal(undefined);
  });
});
