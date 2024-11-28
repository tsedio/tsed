import {catchError} from "@tsed/core";
import {AcceptMime, EndpointMetadata, Get} from "@tsed/schema";

import {PlatformTest} from "../../testing/index.js";
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

      const endpoint = EndpointMetadata.get(Test, "get");
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

      middleware.use(ctx as never);

      expect(request.accepts).toHaveBeenCalledWith(["application/json", "text"]);
    });
    it("should accept type (text)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("text")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
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
      middleware.use(ctx as never);

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
      middleware.use(ctx as never);

      expect(request.accepts).toHaveBeenCalledWith(["application/json", "text"]);
    });
    it("should refuse type", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
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

      const error: any = catchError(() => middleware.use(ctx as never));

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

      const endpoint = EndpointMetadata.get(Test, "get");
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
      middleware.use(ctx as never);

      return expect(request.accepts).not.toHaveBeenCalled();
    });
    it("should accept type (application/json)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
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
      middleware.use(ctx as never);

      expect(request.accepts).toHaveBeenCalledWith(["application/json"]);
    });
    it("should accept type (text)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("text")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
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
      middleware.use(ctx as never);

      expect(request.accepts).toHaveBeenCalledWith(["text"]);
    });
    it("should refuse type", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
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

      const error: any = catchError(() => middleware.use(ctx as never));

      expect(error.message).toEqual("You must accept content-type application/json");
    });
  });
});
