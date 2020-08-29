import {PlatformTest, ValidationError} from "@tsed/common";
import {Env} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";
import {expect} from "chai";
import * as Sinon from "sinon";
import {PlatformExceptionsMiddleware} from "./PlatformExceptionsMiddleware";

const sandbox = Sinon.createSandbox();
describe("PlatformExceptionsMiddleware", () => {
  describe("Env.TEST", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should map string error", () => {
      const middleware = PlatformTest.get<PlatformExceptionsMiddleware>(PlatformExceptionsMiddleware);

      const ctx = PlatformTest.createRequestContext();
      sandbox.stub(ctx.response, "body").returnsThis();
      sandbox.stub(ctx.response, "setHeaders").returnsThis();
      sandbox.stub(ctx.response, "status").returnsThis();

      const error = "MyError";

      middleware.use(error, ctx);

      expect(ctx.response.body).to.have.been.calledWithExactly("MyError");
    });

    it("should map exception", () => {
      const middleware = PlatformTest.get<PlatformExceptionsMiddleware>(PlatformExceptionsMiddleware);

      const ctx = PlatformTest.createRequestContext();
      sandbox.stub(ctx.response, "body").returnsThis();
      sandbox.stub(ctx.response, "setHeaders").returnsThis();
      sandbox.stub(ctx.response, "status").returnsThis();

      const origin = new ValidationError("wrong ID", [
        {
          path: "id",
          error: "format"
        }
      ]);

      const error = new BadRequest("Bad request on ID", origin);
      error.headers = {
        "x-path": "id"
      };

      middleware.use(error, ctx);

      expect(ctx.response.setHeaders).to.have.been.calledWithExactly({"x-path": "id"});
      expect(ctx.response.body).to.have.been.calledWithExactly({
        errors: [
          {
            error: "format",
            path: "id"
          }
        ],
        message: "Bad request on ID, innerException: wrong ID",
        name: "VALIDATION_ERROR",
        status: 400
      });
    });
    it("should map error", () => {
      const middleware = PlatformTest.get<PlatformExceptionsMiddleware>(PlatformExceptionsMiddleware);

      const ctx = PlatformTest.createRequestContext();
      sandbox.stub(ctx.response, "body").returnsThis();
      sandbox.stub(ctx.response, "setHeaders").returnsThis();
      sandbox.stub(ctx.response, "status").returnsThis();

      class Custom extends Error {}

      const error = new Custom("My message");

      middleware.use(error, ctx);

      expect(ctx.response.setHeaders).to.have.been.calledWithExactly({});
      expect(ctx.response.body).to.have.been.calledWithExactly({
        errors: [],
        message: "My message",
        name: "Error",
        status: 500
      });
    });
  });

  describe("Env.PROD", () => {
    beforeEach(() =>
      PlatformTest.create({
        env: Env.PROD
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should map error return internal error in prod profile", () => {
      const middleware = PlatformTest.get<PlatformExceptionsMiddleware>(PlatformExceptionsMiddleware);

      const ctx = PlatformTest.createRequestContext();
      sandbox.stub(ctx.response, "body").returnsThis();
      sandbox.stub(ctx.response, "setHeaders").returnsThis();
      sandbox.stub(ctx.response, "status").returnsThis();

      const error = new Error("My message");

      middleware.use(error, ctx);

      expect(ctx.response.setHeaders).to.have.been.calledWithExactly({});
      expect(ctx.response.body).to.have.been.calledWithExactly("InternalServerError");
    });
  });
});
