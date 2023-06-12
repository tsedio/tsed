import {PlatformHandlerMetadata, PlatformTest} from "@tsed/common";
import {PlatformLogMiddleware} from "./PlatformLogMiddleware";

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
    endpoint: new Map(),
    logger: PlatformTest.injector.logger
  });

  ctx.error = error;

  ctx.handlerMetadata = new PlatformHandlerMetadata({
    handler: () => {}
  });

  jest.spyOn(PlatformTest.injector.logger, "info").mockResolvedValue(undefined);
  jest.spyOn(PlatformTest.injector.logger, "warn").mockResolvedValue(undefined);
  jest.spyOn(PlatformTest.injector.logger, "trace").mockResolvedValue(undefined);
  jest.spyOn(PlatformTest.injector.logger, "debug").mockResolvedValue(undefined);
  jest.spyOn(PlatformTest.injector.logger, "error").mockResolvedValue(undefined);

  ctx.logger.maxStackSize = 0;
  ctx.data = "test";

  ctx.response.getRes().on = jest.fn();

  return {request: ctx.request.raw, ctx, middleware};
}

describe("PlatformLogMiddleware", () => {
  describe("use()", () => {
    describe("when no debug, logRequest", () => {
      beforeEach(() =>
        PlatformTest.create({
          logger: {debug: false, logRequest: true}
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
        expect(PlatformTest.injector.logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.start",
            method: "GET",
            reqId: "id",
            url: "/originalUrl",
            route: "/:id"
          })
        );
        expect(PlatformTest.injector.logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.end",
            method: "GET",
            reqId: "id",
            url: "/originalUrl",
            route: "/:id",
            status: 200,
            state: "OK"
          })
        );
        expect(PlatformTest.injector.logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            duration: expect.any(Number)
          })
        );
        expect(PlatformTest.injector.logger.info).toHaveBeenCalledWith(expect.objectContaining({time: expect.any(Date)}));
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
        expect(PlatformTest.injector.logger.debug).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.start",
            method: "GET",
            reqId: "id",
            url: "url"
          })
        );
        expect(PlatformTest.injector.logger.debug).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.end",
            method: "GET",
            reqId: "id",
            url: "url",
            status: 200,
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
        expect(PlatformTest.injector.logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.start"
          })
        );
      });
    });
    describe("when no debug, logRequest, logEnd", () => {
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
        (ctx.response.getRes().on as jest.Mock).mock.calls[0][1]();
        //  middleware.onLogEnd(request.$ctx as any);

        // THEN
        expect(PlatformTest.injector.logger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.end",
            method: "GET",
            reqId: "id",
            url: "url",
            status: 200
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
        (ctx.response.getRes().on as jest.Mock).mock.calls[0][1]();
        //  middleware.onLogEnd(request.$ctx as any);

        // THEN
        expect(PlatformTest.injector.logger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "request.end",
            method: "GET",
            reqId: "id",
            url: "url",
            status: 400,
            error_name: "Error",
            error_message: "Test"
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
        expect(PlatformTest.injector.logger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "event",
            method: "GET",
            reqId: "id",
            url: "originalUrl"
          })
        );
      });
      it("should log debug without request", async () => {
        // GIVEN
        const {request, ctx, middleware} = await createMiddlewareFixture();
        request.originalUrl = "originalUrl";
        // WHEN
        middleware.use(ctx);

        // THEN
        ctx.logger.debug(
          {
            event: "event"
          },
          false
        );
        // THEN
        expect(PlatformTest.injector.logger.debug).toHaveBeenCalledWith(
          expect.objectContaining({
            event: "event",
            reqId: "id"
          })
        );
      });
    });
  });
});
