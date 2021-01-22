import {AcceptMime, EndpointMetadata, Get, PlatformRequest, PlatformTest} from "@tsed/common";
import {catchError} from "@tsed/core";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeRequest} from "../../../../../test/helper";
import {PlatformAcceptMimesMiddleware} from "./PlatformAcceptMimesMiddleware";

const sandbox = Sinon.createSandbox();

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
      const request: any = new FakeRequest({
        sandbox,
        headers: {
          accept: "application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest(request),
        endpoint
      });

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      middleware.use(ctx);

      expect(request.accepts).to.have.been.calledWithExactly(["application/json", "text"]);
    });
    it("should accept type (text)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("text")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
      const request: any = new FakeRequest({
        sandbox,
        headers: {
          accept: "text/*, application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest(request),
        endpoint
      });

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      middleware.use(ctx);

      expect(request.accepts).to.have.been.calledWithExactly(["text", "application/json"]);
    });
    it("should accept type (text) without endpoint", async () => {
      class Test {
        @Get("/")
        @AcceptMime("text")
        get() {}
      }

      const request: any = new FakeRequest({
        sandbox,
        headers: {
          accept: "text/*, application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest(request)
      });

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      middleware.use(ctx);

      expect(request.accepts).to.have.been.calledWithExactly(["application/json", "text"]);
    });
    it("should refuse type", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
      const request: any = new FakeRequest({
        sandbox,
        headers: {
          accept: "application/xml"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest(request),
        endpoint
      });
      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);

      const error: any = catchError(() => middleware.use(ctx));

      expect(error.message).to.equal("You must accept content-type application/json, text");
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
      const request: any = new FakeRequest({
        sandbox,
        headers: {
          accept: "application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest(request),
        endpoint
      });

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      middleware.use(ctx);

      return expect(request.accepts).to.not.have.been.called;
    });
    it("should accept type (application/json)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
      const request: any = new FakeRequest({
        sandbox,
        headers: {
          accept: "application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest(request),
        endpoint
      });

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      middleware.use(ctx);

      expect(request.accepts).to.have.been.calledWithExactly(["application/json"]);
    });
    it("should accept type (text)", async () => {
      class Test {
        @Get("/")
        @AcceptMime("text")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
      const request: any = new FakeRequest({
        sandbox,
        headers: {
          accept: "text/*, application/json"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest(request),
        endpoint
      });

      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);
      middleware.use(ctx);

      expect(request.accepts).to.have.been.calledWithExactly(["text"]);
    });
    it("should refuse type", async () => {
      class Test {
        @Get("/")
        @AcceptMime("application/json")
        get() {}
      }

      const endpoint = EndpointMetadata.get(Test, "get");
      const request: any = new FakeRequest({
        sandbox,
        headers: {
          accept: "application/xml"
        }
      });
      const ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest(request),
        endpoint
      });
      const middleware = await PlatformTest.invoke<PlatformAcceptMimesMiddleware>(PlatformAcceptMimesMiddleware);

      const error: any = catchError(() => middleware.use(ctx));

      expect(error.message).to.equal("You must accept content-type application/json");
    });
  });
});
