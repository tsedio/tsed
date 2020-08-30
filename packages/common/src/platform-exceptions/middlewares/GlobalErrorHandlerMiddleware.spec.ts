import {PlatformRequest, PlatformResponse, PlatformTest} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {GlobalErrorHandlerMiddleware} from "./GlobalErrorHandlerMiddleware";

describe("GlobalErrorHandlerMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("use()", () => {
    describe("instanceof Exception", () => {
      it(
        "should call the middleware",
        PlatformTest.inject([GlobalErrorHandlerMiddleware], (middleware: GlobalErrorHandlerMiddleware) => {
          const response = new FakeResponse();
          const request = new FakeRequest();
          const error: any = new BadRequest("test");
          error.origin = "origin";

          Sinon.stub(middleware, "setHeaders");

          // @ts-ignore
          middleware.use(error, request, response);

          expect(middleware.setHeaders).to.have.been.calledWithExactly(response, error, "origin");
          expect(response._body).is.equal("test");
          expect(response.statusCode).is.equal(error.status);
        })
      );
    });

    describe("Error as string", () => {
      it(
        "should call the middleware",
        PlatformTest.inject([GlobalErrorHandlerMiddleware], (middleware: GlobalErrorHandlerMiddleware) => {
          const response = new FakeResponse();
          const request = new FakeRequest();
          const error = "message";

          request.ctx = PlatformTest.createRequestContext({
            response: new PlatformResponse(response as any),
            request: new PlatformRequest(request as any),
          });

          // @ts-ignore
          middleware.use(error, request, response);

          expect(response._body).is.equal("message");
          expect(response.statusCode).is.equal(404);
        })
      );
    });

    describe("InternalServerError", () => {
      it(
        "should call the middleware",
        PlatformTest.inject([GlobalErrorHandlerMiddleware], (middleware: GlobalErrorHandlerMiddleware) => {
          const response = new FakeResponse();
          const request = new FakeRequest();
          const error = new Error("test");

          Sinon.stub(middleware, "setHeaders");

          // @ts-ignore
          middleware.use(error, request, response);

          expect(response.statusCode).is.equal(500);
          expect(response._body).is.equal("Internal Error");
          expect(middleware.setHeaders).to.have.been.calledWithExactly(response, error, undefined);
        })
      );
    });
  });

  describe("setHeaders()", () => {
    it(
      "should set headers",
      PlatformTest.inject([GlobalErrorHandlerMiddleware], (middleware: GlobalErrorHandlerMiddleware) => {
        const error: any = new Error("error");
        error.errors = ["test", "test2"];
        error.headers = {"x-header": "value"};

        const response: any = {};
        response.set = Sinon.stub();

        middleware.setHeaders(response, error);

        expect(response.set.getCall(0)).to.have.been.calledWithExactly({"x-header": "value"});
        expect(response.set.getCall(1)).to.have.been.calledWithExactly("errors", JSON.stringify(["test", "test2"]));
      })
    );
  });
});
