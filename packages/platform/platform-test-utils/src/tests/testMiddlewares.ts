import "@tsed/ajv";
import {Context, Controller, Get, Middleware, PlatformTest, Use, UseAfter, UseBefore} from "@tsed/common";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

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

@Controller("/middlewares")
@UseBefore(BeforeCustomMiddleware)
@UseAfter(AfterCustomMiddleware)
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
}

export function testMiddlewares(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

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
}
