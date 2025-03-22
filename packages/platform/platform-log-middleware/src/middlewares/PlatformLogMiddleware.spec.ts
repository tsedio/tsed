import "../domain/PlatformLogMiddlewareSettings.js";

import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformHandlerMetadata} from "@tsed/platform-router";

import {PlatformLogMiddleware} from "./PlatformLogMiddleware.js";

async function createMiddlewareFixture({statusCode = 200, error}: {statusCode?: number; error?: any} = {}) {
  const middleware = await PlatformTest.invoke<PlatformLogMiddleware>(PlatformLogMiddleware);

  const ctx = PlatformTest.createRequestContext({
    event: {
      request: PlatformTest.createRequest({
        method: "GET",
        url: "url",
        originalUrl: undefined
      }),
      response: PlatformTest.createResponse({
        statusCode,
        error
      })
    },
    endpoint: new Map()
  });

  ctx.error = error;

  ctx.handlerMetadata = new PlatformHandlerMetadata({
    handler: () => {}
  });

  vi.spyOn(ctx.logger, "info").mockReturnThis();
  vi.spyOn(ctx.logger, "warn").mockReturnThis();
  vi.spyOn(ctx.logger, "trace").mockReturnThis();
  vi.spyOn(ctx.logger, "debug").mockReturnThis();
  vi.spyOn(ctx.logger, "error").mockReturnThis();

  ctx.logger.maxStackSize = 0;
  ctx.data = "test";

  ctx.response.getRes().on = vi.fn();

  return {request: ctx.request.raw, ctx, middleware};
}

describe("PlatformLogMiddleware", () => {
  describe("use()", () => {
    describe("when no debug, logRequest", () => {
      beforeEach(() =>
        PlatformTest.create({
          logger: {
            debug: false,
            logRequest: true
          }
        })
      );
      afterEach(() => PlatformTest.reset());
      it("should configure request and create context logger", async () => {
        // GIVEN
        const {request, ctx, middleware} = await createMiddlewareFixture();
        request.originalUrl = "/originalUrl";
        ctx.handlerMetadata.path = "/:id";

        // WHEN
        middleware.use(ctx);

        // THEN
        middleware.onLogEnd(request.$ctx);

        // THEN
        expect(ctx.logger.info).toHaveBeenCalledWith({
          event: "request.start"
        });
        expect(ctx.logger.info).toHaveBeenCalledWith({
          event: "request.end",
          status: 200,
          status_code: "200",
          state: "OK"
        });
      });
    });
    describe("when debug, logRequest", () => {
      beforeEach(() =>
        PlatformTest.create({
          logger: {
            level: "debug",
            logRequest: true
          }
        })
      );
      afterEach(() => PlatformTest.reset());

      it("should configure request and create context logger (debug, logRequest)", async () => {
        // GIVEN
        const {ctx, middleware} = await createMiddlewareFixture();

        // WHEN
        middleware.use(ctx);

        // THEN
        middleware.onLogEnd(ctx as any);

        // THEN
        expect(ctx.logger.debug).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.start"
          })
        );
        expect(ctx.logger.debug).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.end",
            status: 200,
            status_code: "200",
            data: "test",
            state: "OK"
          })
        );
      });
    });
    describe("when no debug, logRequest, logEnd", () => {
      beforeEach(() =>
        PlatformTest.create({
          logger: {debug: false, logRequest: true, logEnd: false}
        })
      );
      afterEach(() => PlatformTest.reset());
      it("should configure request and create context logger ()", async () => {
        // GIVEN
        const {request, ctx, middleware} = await createMiddlewareFixture();
        request.originalUrl = "originalUrl";

        // WHEN
        middleware.use(ctx);

        // THEN
        middleware.onLogEnd(request.$ctx as any);

        // THEN
        expect(ctx.logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.start"
          })
        );
      });
    });
    describe("when no debug, logRequest, logStart", () => {
      beforeEach(() =>
        PlatformTest.create({
          logger: {
            debug: false,
            logRequest: true,
            logStart: false
          }
        })
      );
      afterEach(() => PlatformTest.reset());
      it("should configure request and create context logger (no debug, logRequest, logStart)", async () => {
        // GIVEN
        const {ctx, middleware} = await createMiddlewareFixture();

        // WHEN
        middleware.use(ctx);

        // THEN
        vi.mocked(ctx.response.getRes().on).mock.calls[0][1]();
        //  middleware.onLogEnd(request.$ctx as any);

        // THEN
        expect(ctx.logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.end",
            state: "OK",
            status: 200,
            status_code: "200"
          })
        );
      });
      it("should configure request and create context logger (error)", async () => {
        // GIVEN
        const {ctx, middleware} = await createMiddlewareFixture({
          statusCode: 400,
          error: new Error("Test")
        });

        // WHEN
        middleware.use(ctx);

        // THEN
        vi.mocked(ctx.response.getRes().on).mock.calls[0][1]();
        //  middleware.onLogEnd(request.$ctx as any);

        // THEN
        expect(ctx.logger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.end",
            state: "KO",
            status: 400,
            status_code: "400",
            error_name: "Error",
            error_message: "Test"
          })
        );
      });
      it("should configure request and create context logger (error.code)", async () => {
        // GIVEN
        const error: any = {
          code: "CODE",
          message: "message"
        };
        const {ctx, middleware} = await createMiddlewareFixture({
          statusCode: 400,
          error
        });

        // WHEN
        middleware.use(ctx);

        // THEN
        vi.mocked(ctx.response.getRes().on).mock.calls[0][1]();
        //  middleware.onLogEnd(request.$ctx as any);

        // THEN
        expect(ctx.logger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.end",
            status: 400,
            state: "KO",
            status_code: "400",
            error_name: "CODE",
            error_message: "message"
          })
        );
      });
    });
    describe("when no debug, log error", () => {
      beforeEach(() =>
        PlatformTest.create({
          logger: {debug: false, logRequest: true}
        })
      );
      afterEach(() => PlatformTest.reset());
      it("should log error", async () => {
        // GIVEN
        const {request, ctx, middleware} = await createMiddlewareFixture();
        request.originalUrl = "originalUrl";
        // WHEN
        middleware.use(ctx);

        // THEN
        ctx.logger.error({
          event: "event"
        });
        // THEN
        expect(ctx.logger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "event"
          })
        );
      });
    });
  });
});
