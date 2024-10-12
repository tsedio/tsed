import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {BadRequest, Exception, Unauthorized} from "@tsed/exceptions";
import {Err} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Middleware, MiddlewareMethods, Use, UseAfter, UseBefore} from "@tsed/platform-middlewares";
import {Context, QueryParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

@Middleware()
class BeforeCustomMiddleware {
  use(@Context() ctx: Context) {
    ctx.set("stacks", ["UseBefore - Ctrl"]);
  }
}

@Middleware()
class BeforeEndpointCustomMiddleware {
  use(@Context() ctx: Context) {
    ctx.get("stacks").push("UseBefore - endpoint");
  }
}

@Middleware()
class AfterCustomMiddleware {
  use(@Context() ctx: Context) {
    ctx.get("stacks").push("UseAfter - Ctrl");
  }
}

@Middleware()
class UseCustomMiddleware {
  use(@Context() ctx: Context) {
    ctx.get("stacks").push("Use - Ctrl");
  }
}

@Middleware()
class AfterEndpointCustomMiddleware {
  use(@Context() ctx: Context) {
    ctx.get("stacks").push("UseAfter - endpoint");
  }
}

@Middleware()
class UseMiddleware {
  use(@Context() ctx: Context) {
    ctx.get("stacks").push("Use - Ctrl");
  }
}

@Middleware()
class UseEndpointMiddleware {
  use(@Context() ctx: Context) {
    ctx.get("stacks").push("Use - endpoint");
  }
}

@Middleware()
export class CatchErrorMiddleware implements MiddlewareMethods {
  use(@Err() err: Exception) {
    if ([401].includes(err.status)) {
      throw new BadRequest("Bad format");
    }

    throw err;
  }
}

@Controller("/middlewares")
@UseBefore(BeforeCustomMiddleware)
@UseAfter(AfterCustomMiddleware)
@UseAfter(CatchErrorMiddleware)
@Use(UseCustomMiddleware)
class TestMiddlewaresCtrl {
  @Get("/scenario-1")
  @UseBefore(BeforeEndpointCustomMiddleware)
  @UseAfter(AfterEndpointCustomMiddleware)
  @Use(UseEndpointMiddleware)
  scenario1(@Context() context: Context) {
    context.get("stacks").push("endpoint");

    return {stacks: context.get("stacks")};
  }

  @Get("/scenario-2")
  scenario2(@QueryParams("test") test: string) {
    if (test === "error") {
      throw new Unauthorized("Unauthorized");
    }

    return {
      hello: "world"
    };
  }
}

export function testMiddlewares(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestMiddlewaresCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario 1: GET /rest/middlewares/scenario-1", () => {
    it("should call all middlewares", async () => {
      const response = await request.get("/rest/middlewares/scenario-1").expect(200);

      expect(response.body).toEqual({
        stacks: [
          "UseBefore - Ctrl",
          "UseBefore - endpoint",
          "Use - Ctrl",
          "Use - endpoint",
          "endpoint",
          "UseAfter - endpoint",
          "UseAfter - Ctrl"
        ]
      });
    });
  });
  describe("Scenario 2: GET /rest/middlewares/scenario-2", () => {
    it("should call the endpoint without triggering middleware", async () => {
      const response = await request.get("/rest/middlewares/scenario-2").expect(200);

      expect(response.body).toEqual({
        hello: "world"
      });
    });
    it("should call the endpoint, throw an error and transform the error by calling the error middleware", async () => {
      const response = await request.get("/rest/middlewares/scenario-2?test=error").expect(400);

      expect(response.body).toEqual({
        errors: [],
        message: "Bad format",
        name: "BAD_REQUEST",
        status: 400
      });
    });
  });
}
