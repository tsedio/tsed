import {PlatformTest, ValidationError} from "@tsed/common";
import {Env} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";
import {PlatformExceptions} from "./PlatformExceptions.js";

describe("PlatformExceptions", () => {
  describe("Env.TEST", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    beforeEach(() => {
      jest.spyOn(PlatformTest.injector.logger, "error").mockReturnValue(undefined);
    });

    it("should map string error", () => {
      const platformExceptions = PlatformTest.get<PlatformExceptions>(PlatformExceptions);

      const ctx = PlatformTest.createRequestContext();
      jest.spyOn(ctx.response, "body").mockReturnThis();
      jest.spyOn(ctx.response, "setHeaders").mockReturnThis();
      jest.spyOn(ctx.response, "status").mockReturnThis();
      jest.spyOn(ctx.response, "contentType").mockReturnThis();

      const error = "MyError";

      platformExceptions.catch(error, ctx);

      expect(ctx.response.body).toBeCalledWith("MyError");
    });
    it("should map exception", () => {
      const middleware = PlatformTest.get<PlatformExceptions>(PlatformExceptions);

      const ctx = PlatformTest.createRequestContext();
      jest.spyOn(ctx.response, "body").mockReturnThis();
      jest.spyOn(ctx.response, "setHeaders").mockReturnThis();
      jest.spyOn(ctx.response, "status").mockReturnThis();
      jest.spyOn(ctx.response, "contentType").mockReturnThis();

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

      expect(ctx.response.setHeaders).toBeCalledWith({"x-path": "id"});
      expect(ctx.response.body).toBeCalledWith({
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
      jest.spyOn(ctx.response, "body").mockReturnThis();
      jest.spyOn(ctx.response, "setHeaders").mockReturnThis();
      jest.spyOn(ctx.response, "status").mockReturnThis();
      jest.spyOn(ctx.response, "contentType").mockReturnThis();

      class Custom extends Error {}

      const error = new Custom("My message");

      middleware.catch(error, ctx);

      expect(ctx.response.setHeaders).toBeCalledWith({});
      expect(ctx.response.body).toBeCalledWith({
        errors: [],
        message: "My message",
        name: "Error",
        status: 500,
        stack: undefined
      });
    });
    it("should map error from given name", () => {
      const middleware = PlatformTest.get<PlatformExceptions>(PlatformExceptions);

      const ctx = PlatformTest.createRequestContext();
      jest.spyOn(ctx.response, "body").mockReturnThis();
      jest.spyOn(ctx.response, "setHeaders").mockReturnThis();
      jest.spyOn(ctx.response, "status").mockReturnThis();
      jest.spyOn(ctx.response, "contentType").mockReturnThis();

      class MongooseError extends Error {}

      const error = new MongooseError("My message");

      middleware.catch(error, ctx);

      expect(ctx.response.setHeaders).toBeCalledWith({});
      expect(ctx.response.body).toBeCalledWith({
        errors: [],
        message: "My message, innerException: My message",
        name: "Error",
        stack: undefined,
        status: 400
      });
    });
    it("should map raw error", () => {
      const platformExceptions = PlatformTest.get<PlatformExceptions>(PlatformExceptions);

      const ctx = PlatformTest.createRequestContext();
      jest.spyOn(ctx.response, "body").mockReturnThis();
      jest.spyOn(ctx.response, "setHeaders").mockReturnThis();
      jest.spyOn(ctx.response, "status").mockReturnThis();
      jest.spyOn(ctx.response, "contentType").mockReturnThis();

      const error = {
        status: 413,
        name: "PayloadTooLargeError",
        message: "request entity too large"
      };

      platformExceptions.catch(error, ctx);

      expect(ctx.response.body).toBeCalledWith({
        errors: [],
        message: "request entity too large",
        name: "PayloadTooLargeError",
        stack: undefined,
        status: 413
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
      jest.spyOn(ctx.response, "body").mockReturnThis();
      jest.spyOn(ctx.response, "setHeaders").mockReturnThis();
      jest.spyOn(ctx.response, "status").mockReturnThis();
      jest.spyOn(ctx.response, "contentType").mockReturnThis();

      const error = new Error("My message");

      middleware.catch(error, ctx);

      expect(ctx.response.setHeaders).toBeCalledWith({});
      expect(ctx.response.body).toBeCalledWith("InternalServerError");
    });
  });
  describe("resourceNotFound()", () => {
    beforeEach(() =>
      PlatformTest.create({
        env: Env.PROD
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should map error return internal error in prod profile", () => {
      const middleware = PlatformTest.get<PlatformExceptions>(PlatformExceptions);

      const ctx = PlatformTest.createRequestContext();
      ctx.request.raw.url = "url";

      jest.spyOn(ctx.response, "body").mockReturnThis();
      jest.spyOn(ctx.response, "setHeaders").mockReturnThis();
      jest.spyOn(ctx.response, "status").mockReturnThis();
      jest.spyOn(ctx.response, "contentType").mockReturnThis();

      middleware.resourceNotFound(ctx);

      expect(ctx.response.setHeaders).toBeCalledWith({});
      expect(ctx.response.body).toBeCalledWith({
        errors: [],
        message: 'Resource "url" not found',
        name: "NOT_FOUND",
        stack: undefined,
        status: 404
      });
    });
  });
});
