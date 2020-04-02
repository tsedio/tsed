import {assert, expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../../test/helper";

const middleware: any = Sinon.stub();
const useAfterStub: any = Sinon.stub().returns(middleware);

const {ContentType} = Proxyquire.load("../../../../src/mvc/decorators/method/contentType", {
  "./useAfter": {UseAfter: useAfterStub}
});

class Test {}

describe("ContentType", () => {
  const descriptor = {};
  const options = "application/json";

  it("should create middleware", () => {
    ContentType(options)(Test, "test", descriptor);

    expect(useAfterStub.args[0][0]).to.be.a("function");
    assert(middleware.calledWith(Test, "test", descriptor));
  });

  it("should call response method", () => {
    const nextSpy = Sinon.stub();
    const response = new FakeResponse();
    Sinon.stub(response, "type");

    ContentType(options)(Test, "test", descriptor);

    const middleware = useAfterStub.args[0][0];
    middleware({}, response, nextSpy);

    // @ts-ignore
    assert(response.type.calledWith(options), "method not called");
    assert(nextSpy.called, "function not called");
  });
});
