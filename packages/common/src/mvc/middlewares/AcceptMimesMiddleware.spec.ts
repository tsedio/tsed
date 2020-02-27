import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {AcceptMimesMiddleware} from "../../../src/mvc";

describe("AcceptMimesMiddleware", () => {
  describe("when success", () => {
    before(
      inject([AcceptMimesMiddleware], (middleware: AcceptMimesMiddleware) => {
        this.middleware = middleware;

        const acceptStub = Sinon.stub();
        acceptStub.withArgs("application/xml").returns(true);
        acceptStub.withArgs("application/json").returns(false);

        this.request = {
          accepts: acceptStub
        };
        this.endpoint = {
          get: () => {
            return ["application/json", "application/xml"];
          }
        };

        try {
          this.result = this.middleware.use(this.endpoint, this.request);
        } catch (er) {
          this.error = er;
        }
      })
    );

    it("should accept the type", () => {
      expect(this.result).to.equal(undefined);
    });

    it("should call request.accepts methods", () => {
      this.request.accepts.should.have.been.calledWithExactly("application/json").and.calledWithExactly("application/xml");
    });

    it("shouldn't emit error", () => {
      expect(this.error).to.equal(undefined);
    });
  });

  describe("when error", () => {
    before(
      inject([AcceptMimesMiddleware], (middleware: AcceptMimesMiddleware) => {
        this.middleware = middleware;

        const acceptStub = Sinon.stub();
        acceptStub.withArgs("application/xml").returns(false);
        acceptStub.withArgs("application/json").returns(false);

        this.request = {
          accepts: acceptStub
        };
        this.endpoint = {
          get: () => {
            return ["application/json", "application/xml"];
          }
        };

        try {
          this.result = this.middleware.use(this.endpoint, this.request);
        } catch (er) {
          this.error = er;
        }
      })
    );

    it("should call request.accepts methods", () => {
      this.request.accepts.should.have.been.calledWithExactly("application/json").and.calledWithExactly("application/xml");
    });

    it("shouldn't emit error", () => {
      expect(this.error.message).to.equal("You must accept content-type application/json, application/xml");
    });
  });
});
