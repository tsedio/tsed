import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {AcceptMimesMiddleware} from "../../../src/mvc";

describe("AcceptMimesMiddleware", () => {
  describe("when success", () => {
    it("should accept the type", inject([AcceptMimesMiddleware], (middleware: AcceptMimesMiddleware) => {
      const acceptStub = Sinon.stub();
      acceptStub.withArgs("application/xml").returns(true);
      acceptStub.withArgs("application/json").returns(false);

      const request = {
        accepts: acceptStub
      };
      const endpoint = {
        get: () => {
          return ["application/json", "application/xml"];
        }
      };

      // @ts-ignore
      const result = middleware.use(endpoint, request);
      expect(result).to.equal(undefined);
      request.accepts.should.have.been.calledWithExactly("application/json").and.calledWithExactly("application/xml");
    }));
  });

  describe("when error", () => {
    it("should call request.accepts methods", inject([AcceptMimesMiddleware], (middleware: AcceptMimesMiddleware) => {
      const acceptStub = Sinon.stub();
      acceptStub.withArgs("application/xml").returns(false);
      acceptStub.withArgs("application/json").returns(false);

      const request = {
        accepts: acceptStub
      };
      const endpoint = {
        get: () => {
          return ["application/json", "application/xml"];
        }
      };
      let error: any;

      try {
        // @ts-ignore
        middleware.use(endpoint, request);
      } catch (er) {
        error = er;
      }
      expect(error.message).to.equal("You must accept content-type application/json, application/xml");
    }));
  });
});
