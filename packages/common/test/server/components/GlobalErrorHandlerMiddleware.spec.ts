import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {BadRequest} from "ts-httpexceptions/lib";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {GlobalErrorHandlerMiddleware} from "../../../src/server";

describe("GlobalErrorHandlerMiddleware", () => {
  before(
    inject([GlobalErrorHandlerMiddleware], (middleware: GlobalErrorHandlerMiddleware) => {
      this.middleware = middleware;
    })
  );

  describe("use()", () => {
    before(() => {
      this.response = new FakeResponse();
      this.request = new FakeRequest();
    });

    after(() => {
      delete this.response;
      delete this.request;
    });

    describe("instanceof Exception", () => {
      before(() => {
        this.error = new BadRequest("test");
        this.error.origin = "origin";

        this.setHeaderStub = Sinon.stub(this.middleware, "setHeaders");

        this.middleware.use(this.error, this.request, this.response);
      });

      after(() => {
        this.setHeaderStub.restore();
      });

      it("should have a message body", () => {
        expect(this.response._body).is.equal("test");
      });

      it("should call the method setHeaders()", () => {
        this.setHeaderStub.should.have.been.calledWithExactly(this.response, this.error, "origin");
      });

      it("should have a status", () => {
        expect(this.response.statusCode).is.equal(this.error.status);
      });
    });

    describe("Error as string", () => {
      before(() => {
        this.error = "message";
        this.nextSpy = Sinon.stub();

        this.middleware.use(this.error, this.request, this.response);
      });

      after(() => {
        delete this.error;
      });

      it("should have an empty body", () => {
        expect(this.response._body).is.equal("message");
      });

      it("should have a status", () => {
        expect(this.response.statusCode).is.equal(404);
      });
    });

    describe("InternalServerError", () => {
      before(() => {
        this.error = new Error("test");

        this.setHeaderStub = Sinon.stub(this.middleware, "setHeaders");

        this.middleware.use(this.error, this.request, this.response);
      });

      after(() => {
        this.setHeaderStub.restore();
      });

      it("should have an empty body", () => {
        expect(this.response._body).is.equal("Internal Error");
      });

      it("should call the method setHeaders()", () => {
        this.setHeaderStub.should.have.been.calledWithExactly(this.response, this.error, undefined);
      });

      it("should have a status", () => {
        expect(this.response.statusCode).is.equal(500);
      });
    });
  });

  describe("setHeaders()", () => {
    const response: any = {};
    before(() => {
      const error: any = new Error("error");
      error.errors = ["test", "test2"];
      error.headers = {"x-header": "value"};
      response.set = Sinon.stub();

      this.middleware.setHeaders(response, error);
    });

    it("should set headers", () => {
      response.set.getCall(0).should.have.been.calledWithExactly({"x-header": "value"});
    });

    it("should set errors headers", () => {
      response.set.getCall(1).should.have.been.calledWithExactly("errors", JSON.stringify(["test", "test2"]));
    });
  });
});
