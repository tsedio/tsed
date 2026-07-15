import {catchAsyncError} from "@tsed/core";
import {runInContext} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {AcceptMime, Get, s} from "@tsed/schema";

import {PlatformAcceptMimesMiddleware} from "./PlatformAcceptMimesMiddleware.js";

describe("PlatformMimesMiddleware", () => {
  describe("when server has configuration", () => {
    beforeEach(() =>
      PlatformTest.create({
        acceptMimes: ["application/json", "text"]
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should accept type (application/json)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = s.store.method(Test, "get");
      const request = PlatformTest.createRequest({
        headers: {
          accept: "application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        event: {request},
        endpoint
      });

      vi.spyOn(request, "accepts");

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);

      await runInContext(ctx, () => middleware.use());

      expect(request.accepts).toHaveBeenCalledWith(["application/json", "text"]);
    });
    it("should accept type (text)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("text")
        get() {}
      }

      const endpoint = s.store.method(Test, "get");
      const request: any = PlatformTest.createRequest({
        headers: {
          accept: "text/*, application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        event: {request},
        endpoint
      });

      vi.spyOn(request, "accepts");

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      await runInContext(ctx, () => middleware.use());

      expect(request.accepts).toHaveBeenCalledWith(["text", "application/json"]);
    });
    it("should accept type (text) without endpoint", async () => {
      class Test {
        @Get("/")
        @AcceptMime("text")
        get() {}
      }

      const request: any = PlatformTest.createRequest({
        headers: {
          accept: "text/*, application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        event: {request}
      });
      vi.spyOn(request, "accepts");

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      await runInContext(ctx, () => middleware.use());

      expect(request.accepts).toHaveBeenCalledWith(["application/json", "text"]);
    });
    it("should refuse type", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = s.store.method(Test, "get");
      const request: any = PlatformTest.createRequest({
        headers: {
          accept: "application/xml"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        event: {request},
        endpoint
      });
      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);

      const error: any = await catchAsyncError(() => runInContext(ctx, () => middleware.use()));

      expect(error.message).toEqual("You must accept content-type application/json, text");
    });
  });
  describe("when server hasn't configuration", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should do noting", async () => {
      class Test {
        @Get("/")
        get() {}
      }

      const endpoint = s.store.method(Test, "get");
      const request: any = PlatformTest.createRequest({
        headers: {
          accept: "application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        event: {request},
        endpoint
      });
      vi.spyOn(request, "accepts");

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      await runInContext(ctx, () => middleware.use());

      return expect(request.accepts).not.toHaveBeenCalled();
    });
    it("should accept type (application/json)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = s.store.method(Test, "get");
      const request: any = PlatformTest.createRequest({
        headers: {
          accept: "application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        event: {request},
        endpoint
      });
      vi.spyOn(request, "accepts");

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      await runInContext(ctx, () => middleware.use());

      expect(request.accepts).toHaveBeenCalledWith(["application/json"]);
    });
    it("should accept type (text)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("text")
        get() {}
      }

      const endpoint = s.store.method(Test, "get");
      const request: any = PlatformTest.createRequest({
        headers: {
          accept: "text/*, application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        event: {
          request
        },
        endpoint
      });
      vi.spyOn(request, "accepts");

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      await runInContext(ctx, () => middleware.use());

      expect(request.accepts).toHaveBeenCalledWith(["text"]);
    });
    it("should refuse type", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = s.store.method(Test, "get");
      const request: any = PlatformTest.createRequest({
        headers: {
          accept: "application/xml"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        event: {request},
        endpoint
      });

      vi.spyOn(request, "accepts");

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);

      const error: any = await catchAsyncError(() => runInContext(ctx, () => middleware.use()));

      expect(error.message).toEqual("You must accept content-type application/json");
    });
  });
});
