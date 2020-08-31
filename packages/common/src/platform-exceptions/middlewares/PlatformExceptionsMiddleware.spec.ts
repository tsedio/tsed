import {PlatformRequest, PlatformResponse, PlatformTest} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {expect} from "chai";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {PlatformExceptionsMiddleware} from "./PlatformExceptionsMiddleware";

describe("PlatformExceptionsMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("use()", () => {
    describe("instanceof Exception", () => {
      it(
        "should call the middleware",
        PlatformTest.inject([PlatformExceptionsMiddleware], (middleware: PlatformExceptionsMiddleware) => {
          const response = new FakeResponse();
          const request = new FakeRequest();
          const error: any = new BadRequest("test");
          error.origin = "origin";

          const ctx = PlatformTest.createRequestContext({
            response: new PlatformResponse(response as any),
            request: new PlatformRequest(request as any)
          });

          let actualError: any;
          try {
            middleware.use(error, ctx);
          } catch (er) {
            actualError = er;
          }

          expect(actualError.message).is.equal("test");
        })
      );
    });

    describe("Error as string", () => {
      it(
        "should call the middleware",
        PlatformTest.inject([PlatformExceptionsMiddleware], (middleware: PlatformExceptionsMiddleware) => {
          const response = new FakeResponse();
          const request = new FakeRequest();
          const error = "message";

          const ctx = PlatformTest.createRequestContext({
            response: new PlatformResponse(response as any),
            request: new PlatformRequest(request as any)
          });
          // @ts-ignore
          middleware.use(error, ctx);

          expect(response._body).is.equal("message");
          expect(response.statusCode).is.equal(404);
        })
      );
    });
  });
});
