import {Store} from "@tsed/core";
import {assert, expect} from "chai";
import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../../test/helper";

let middleware: any;
const useAfterStub: any = (_middleware_: any) => {
  middleware = _middleware_;

  return () => {
  };
};

const Header = Proxyquire.load("../../../../src/mvc/decorators/method/header", {
  "./useAfter": {UseAfter: useAfterStub}
}).Header;

class Test {
}

describe("Header", () => {
  describe("when is used as method decorator", () => {
    before(() => {
      this.request = new FakeRequest();
      this.response = new FakeResponse();
      Sinon.stub(this.response, "set").returns(this.response);
      this.nextSpy = Sinon.spy();
    });

    after(() => {
      delete this.request;
      delete this.response;
      delete this.nextSpy;
    });

    describe("with one params has object", () => {
      before(() => {
        Header({"Content-Type": "application/json"})(Test, "test", {});
        middleware(this.request, this.response, this.nextSpy);
      });

      it("should set header when middleware is called", () => {
        assert(this.response.set.calledWith("Content-Type", "application/json"), "parameters mismatch");
      });
      it("should call next function", () => {
        assert(this.nextSpy.called, "next isn't called");
      });
    });

    describe("with two params", () => {
      before(() => {
        Header("Content-Type", "application/json")(Test, "test", {});
        middleware(this.request, this.response, this.nextSpy);
      });

      it("should set header when middleware is called", () => {
        assert(this.response.set.calledWith("Content-Type", "application/json"), "parameters mismatch");
      });
      it("should call next function", () => {
        assert(this.nextSpy.called, "next isn't called");
      });
    });

    describe("with headerSent", () => {
      before(() => {
        Header({"Content-Type": "application/json"})(Test, "test", {});
        this.response.headersSent = true;
        middleware(this.request, this.response, this.nextSpy);
      });

      it("should call next function", () => {
        assert(this.nextSpy.called, "next isn't called");
      });
    });

    describe("swagger spec", () => {
      before(() => {
        Header({
          "Content-Type": "text/plain",
          "Content-Length": 123,
          ETag: {
            value: "12345",
            description: "header description"
          }
        })(Test, "test", {});

        this.store = Store.from(Test, "test", {});
      });

      it("should store the swagger responses", () => {
        expect(this.store.get("response")).to.deep.eq({
          headers: {
            "Content-Length": {
              type: "number",
              value: 123
            },
            "Content-Type": {
              type: "string",
              value: "text/plain"
            },
            ETag: {
              description: "header description",
              type: "string",
              value: "12345"
            }
          }
        });
      });
    });
  });
});
