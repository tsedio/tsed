import {PlatformTest, ValidationError} from "@tsed/common";
import {Env} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";
import {expect} from "chai";
import * as Sinon from "sinon";
import {PlatformExceptions} from "./PlatformExceptions";

const sandbox = Sinon.createSandbox();
describe("PlatformExceptions", () => {
  describe("Env.TEST", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should map string error", () => {
      const platformExceptions = PlatformTest.get<PlatformExceptions>(PlatformExceptions);

      const ctx = PlatformTest.createRequestContext();
      sandbox.stub(ctx.response, "body").returnsThis();
      sandbox.stub(ctx.response, "setHeaders").returnsThis();
      sandbox.stub(ctx.response, "status").returnsThis();
      sandbox.stub(ctx.response, "contentType").returnsThis();

      const error = "MyError";

      platformExceptions.catch(error, ctx);

      expect(ctx.response.body).to.have.been.calledWithExactly("MyError");
    });

    it("should map exception", () => {
      const middleware = PlatformTest.get<PlatformExceptions>(PlatformExceptions);

      const ctx = PlatformTest.createRequestContext();
      sandbox.stub(ctx.response, "body").returnsThis();
      sandbox.stub(ctx.response, "setHeaders").returnsThis();
      sandbox.stub(ctx.response, "status").returnsThis();
      sandbox.stub(ctx.response, "contentType").returnsThis();

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

      middleware.catch(error, ctx);

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
        status: 400,
        stack: undefined
      });
    });
    it("should map error", () => {
      const middleware = PlatformTest.get<PlatformExceptions>(PlatformExceptions);

      const ctx = PlatformTest.createRequestContext();
      sandbox.stub(ctx.response, "body").returnsThis();
      sandbox.stub(ctx.response, "setHeaders").returnsThis();
      sandbox.stub(ctx.response, "status").returnsThis();
      sandbox.stub(ctx.response, "contentType").returnsThis();

      class Custom extends Error {}

      const error = new Custom("My message");

      middleware.catch(error, ctx);

      expect(ctx.response.setHeaders).to.have.been.calledWithExactly({});
      expect(ctx.response.body).to.have.been.calledWithExactly({
        errors: [],
        message: "My message",
        name: "Error",
        status: 500,
        stack: undefined
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
      const middleware = PlatformTest.get<PlatformExceptions>(PlatformExceptions);

      const ctx = PlatformTest.createRequestContext();
      sandbox.stub(ctx.response, "body").returnsThis();
      sandbox.stub(ctx.response, "setHeaders").returnsThis();
      sandbox.stub(ctx.response, "status").returnsThis();
      sandbox.stub(ctx.response, "contentType").returnsThis();

      const error = new Error("My message");

      middleware.catch(error, ctx);

      expect(ctx.response.setHeaders).to.have.been.calledWithExactly({});
      expect(ctx.response.body).to.have.been.calledWithExactly("InternalServerError");
    });
  });
});
