import {expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../../test/helper";

const middleware: any = Sinon.stub();
const useAfterStub: any = Sinon.stub().returns(middleware);

const {Location} = Proxyquire.load("../../../../src/mvc/decorators/method/location", {
  "./useAfter": {UseAfter: useAfterStub}
});

class Test {}

describe("Location", () => {
  const descriptor = {};
  const options = "test";
  let middleware: any;

  beforeEach(() => {
    // WHEN
    Location(options)(Test, "test", descriptor);
    middleware = useAfterStub.args[0][0];
  });

  it("should create middleware", () => {
    expect(middleware).to.be.a("function");
  });

  describe("when middleware is executed", () => {
    it("should call response method and call next", () => {
      const nextSpy = Sinon.stub();
      const response = new FakeResponse();

      Sinon.stub(response, "location");

      middleware({}, response, nextSpy);

      response.location.should.have.been.calledWithExactly(options);

      return nextSpy.should.have.been.calledOnce;
    });
  });

  describe("when middleware is executed but header is sent", () => {
    it("should call response method and call next function", () => {
      const nextSpy = Sinon.stub();
      const response = new FakeResponse();
      response.headersSent = true;

      Sinon.stub(response, "location");
      Sinon.stub(response, "type");

      middleware({}, response, nextSpy);

      return response.type.should.not.have.been.called && nextSpy.should.have.been.calledOnce;
    });
  });
});
