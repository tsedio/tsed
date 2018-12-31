import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../../test/helper";

const middleware: any = Sinon.stub();
const useAfterStub: any = Sinon.stub().returns(middleware);

const {Status} = Proxyquire.load("../../../../src/mvc/decorators/method/status", {
  "./useAfter": {UseAfter: useAfterStub}
});

class Test {
}

describe("Status", () => {
  before(() => {
    this.descriptor = {};
    this.options = 200;
    Status(this.options, {
      description: "description",
      use: "use",
      collection: "collection",
      headers: {
        "200": {
          value: "headers"
        }
      }
    })(Test, "test", this.descriptor);
    this.middleware = useAfterStub.args[0][0];
    this.store = Store.from(Test, "test", this.descriptor);
  });

  after(() => {
    delete this.descriptor;
    delete this.options;
    delete this.middleware;
  });

  it("should create middleware", () => {
    expect(this.middleware).to.be.a("function");
    middleware.should.be.calledWithExactly(Test, "test", this.descriptor);
  });

  it("should store responses in the Store", () => {
    expect(this.store.get("responses")).to.deep.eq({
      "200": {
        collectionType: "collection",
        description: "description",
        type: "use",
        headers: {
          "200": {
            value: "headers"
          }
        }
      }
    });

    expect(this.store.get("response")).to.deep.eq({
      collectionType: "collection",
      description: "description",
      type: "use",
      headers: {
        "200": {
          value: "headers"
        }
      }
    });
  });

  it("should store statusCode in the Store", () => {
    expect(this.store.get("statusCode")).to.eq(200);
  });

  describe("when middleware is executed", () => {
    before(() => {
      this.nextSpy = Sinon.stub();
      this.response = new FakeResponse();
      Sinon.stub(this.response, "status");

      this.middleware({}, this.response, this.nextSpy);
    });

    after(() => {
      delete this.response;
      delete this.nextSpy;
    });

    it("should call response method", () => {
      this.response.status.should.be.calledWith(this.options);
    });

    it("should call next function", () => {
      return this.nextSpy.should.be.calledOnce;
    });

    it("shoul store data in the Store", () => {
      this.store.get("responses", {});
    });
  });
});
