import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {BadRequest} from "@tsed/exceptions";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {GlobalErrorHandlerMiddleware} from "./GlobalErrorHandlerMiddleware";

describe("GlobalErrorHandlerMiddleware", () => {
  beforeEach(() => TestContext.create());
  afterEach(() => TestContext.reset());

  describe("use()", () => {
    describe("instanceof Exception", () => {
      it("should call the middleware", inject([GlobalErrorHandlerMiddleware], (middleware: GlobalErrorHandlerMiddleware) => {
        const response = new FakeResponse();
        const request = new FakeRequest();
        const error: any = new BadRequest("test");
        error.origin = "origin";

        Sinon.stub(middleware, "setHeaders");

        // @ts-ignore
        middleware.use(error, request, response);

        middleware.setHeaders.should.have.been.calledWithExactly(response, error, "origin");
        expect(response._body).is.equal("test");
        expect(response.statusCode).is.equal(error.status);
      }));
    });

    describe("Error as string", () => {
      it("should call the middleware", inject([GlobalErrorHandlerMiddleware], (middleware: GlobalErrorHandlerMiddleware) => {
        const response = new FakeResponse();
        const request = new FakeRequest();
        const error = "message";

        // @ts-ignore
        middleware.use(error, request, response);

        expect(response._body).is.equal("message");
        expect(response.statusCode).is.equal(404);
      }));
    });

    describe("InternalServerError", () => {
      it("should call the middleware", inject([GlobalErrorHandlerMiddleware], (middleware: GlobalErrorHandlerMiddleware) => {
        const response = new FakeResponse();
        const request = new FakeRequest();
        const error = new Error("test");

        Sinon.stub(middleware, "setHeaders");

        // @ts-ignore
        middleware.use(error, request, response);

        expect(response.statusCode).is.equal(500);
        expect(response._body).is.equal("Internal Error");
        middleware.setHeaders.should.have.been.calledWithExactly(response, error, undefined);
      }));
    });
  });

  describe("setHeaders()", () => {
    it("should set headers", inject([GlobalErrorHandlerMiddleware], (middleware: GlobalErrorHandlerMiddleware) => {
      const error: any = new Error("error");
      error.errors = ["test", "test2"];
      error.headers = {"x-header": "value"};

      const response: any = {};
      response.set = Sinon.stub();

      middleware.setHeaders(response, error);

      response.set.getCall(0).should.have.been.calledWithExactly({"x-header": "value"});
      response.set.getCall(1).should.have.been.calledWithExactly("errors", JSON.stringify(["test", "test2"]));
    }));
  });
});
