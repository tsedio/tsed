import {Get, Header, Redirect, Returns} from "@tsed/schema";
import {Middleware, UseBefore} from "@tsed/platform-middlewares";
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {$off, $on} from "@tsed/hooks";
import {Catch} from "@tsed/platform-exceptions";
import {BadRequest} from "@tsed/exceptions";
import {Context} from "@tsed/platform-params";
import {Controller} from "@tsed/di";
import {Next, PlatformContext} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestingSdkOpts} from "../interfaces/index.js";
import {ResponseFilter} from "@tsed/platform-response-filter";
import SuperTest from "supertest";

const WRAPPED_TYPE = "application/vnd.pipeline+json";
const FAILING_TYPE = "application/vnd.pipeline-fail+json";

function track($ctx: PlatformContext, step: string) {
  $ctx.set("steps", [...($ctx.get("steps") || []), step]);
}

class PipelineError extends BadRequest {}

const caughtErrors: string[] = [];

@Catch(PipelineError)
class PipelineErrorFilter {
  catch(error: PipelineError, $ctx: PlatformContext) {
    caughtErrors.push(error.message);
    $ctx.response.status(error.status).body({pipelineError: error.message});
  }
}

@Middleware()
class SyncPipelineMiddleware {
  use(@Context() $ctx: PlatformContext) {
    track($ctx, "sync-middleware");
  }
}

@Middleware()
class NextPipelineMiddleware {
  use(@Context() $ctx: PlatformContext, @Next() next: (err?: unknown) => void) {
    setTimeout(() => {
      track($ctx, "next-middleware");
      next();
    }, 5);
  }
}

@ResponseFilter(WRAPPED_TYPE)
class WrappingResponseFilter {
  transform(data: unknown) {
    return {wrapped: data};
  }
}

@ResponseFilter(FAILING_TYPE)
class FailingResponseFilter {
  transform() {
    throw new PipelineError("response filter failure");
  }
}

@Controller("/pipeline")
class TestRequestPipelineCtrl {
  @Get("/sync")
  @Returns(200, String)
  sync() {
    return "hello world";
  }

  @Get("/sync-middleware-async-endpoint")
  @UseBefore(SyncPipelineMiddleware)
  async syncMiddlewareAsyncEndpoint(@Context() $ctx: PlatformContext) {
    await new Promise((resolve) => setTimeout(resolve, 5));
    track($ctx, "endpoint");

    return {steps: $ctx.get("steps")};
  }

  @Get("/next-middleware")
  @UseBefore(NextPipelineMiddleware)
  nextMiddleware(@Context() $ctx: PlatformContext) {
    track($ctx, "endpoint");

    return {steps: $ctx.get("steps")};
  }

  @Get("/effects")
  @(Returns(201).ContentType(WRAPPED_TYPE))
  @Header("x-pipeline", "1")
  effects() {
    return {id: "1"};
  }

  @Get("/redirect")
  @Redirect(302, "/other")
  redirect() {}

  @Get("/throw")
  throwSync() {
    throw new PipelineError("sync failure");
  }

  @Get("/failing-filter")
  @(Returns(200).ContentType(FAILING_TYPE))
  failingFilter() {
    return {id: "1"};
  }
}

export function testRequestPipeline(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestRequestPipelineCtrl]
      },
      imports: [...((options as any).imports || []), PipelineErrorFilter],
      responseFilters: [WrappingResponseFilter, FailingResponseFilter] as never[]
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("synchronous route", () => {
    it("should send the value returned by a sync endpoint", async () => {
      const {text} = await request.get("/rest/pipeline/sync").expect(200);

      expect(text).toEqual("hello world");
    });

    it("should apply the status, the headers and the response filter in order", async () => {
      const response = await request.get("/rest/pipeline/effects").expect(201);

      expect(response.headers["x-pipeline"]).toEqual("1");
      expect(response.headers["content-type"]).toContain(WRAPPED_TYPE);
      expect(JSON.parse(response.text)).toEqual({wrapped: {id: "1"}});
    });

    it("should redirect from a sync endpoint", async () => {
      const response = await request.get("/rest/pipeline/redirect").expect(302);

      expect(response.headers["location"]).toEqual("/other");
    });
  });

  describe("asynchronous handlers", () => {
    it("should run a sync middleware before an async endpoint", async () => {
      const {body} = await request.get("/rest/pipeline/sync-middleware-async-endpoint").expect(200);

      expect(body).toEqual({steps: ["sync-middleware", "endpoint"]});
    });

    it("should run the endpoint only after the middleware calls next", async () => {
      const {body} = await request.get("/rest/pipeline/next-middleware").expect(200);

      expect(body).toEqual({steps: ["next-middleware", "endpoint"]});
    });
  });

  describe("$alterRunInContext listener", () => {
    const ref = {};

    afterEach(() => $off(ref as any));

    it("should run the request inside the async callback returned by the listener", async () => {
      // like @tsed/mikro-orm, which runs each request inside a MikroORM RequestContext
      let wrapped = 0;

      $on("$alterRunInContext", ref, (next: () => unknown) => async () => {
        wrapped++;

        return next();
      });

      const {text} = await request.get("/rest/pipeline/sync").expect(200);

      expect(text).toEqual("hello world");
      expect(wrapped).toBeGreaterThan(0);
    });
  });

  describe("errors", () => {
    beforeEach(() => {
      caughtErrors.length = 0;
    });

    it("should send an error thrown by a sync endpoint to the exception filters", async () => {
      const {body} = await request.get("/rest/pipeline/throw").expect(400);

      expect(body).toEqual({pipelineError: "sync failure"});
      expect(caughtErrors).toEqual(["sync failure"]);
    });

    it("should send an error thrown by a response filter to the exception filters", async () => {
      const {body} = await request.get("/rest/pipeline/failing-filter").expect(400);

      expect(body).toEqual({pipelineError: "response filter failure"});
      expect(caughtErrors).toEqual(["response filter failure"]);
    });
  });
}
