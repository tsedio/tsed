import {Controller} from "@tsed/di";
import {PlatformContext, Req} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Middleware, Use} from "@tsed/platform-middlewares";
import {Context, Locals} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

@Middleware()
class LocalsMiddleware {
  use(@Req() request: any, @Locals() locals: any, @Context() ctx: PlatformContext) {
    locals.id = "local-10909";
    ctx.set("uid", "ctx-10909");
  }
}

@Controller("/locals")
class LocalsCtrl {
  @Get("/scenario-1")
  @Use(LocalsMiddleware)
  public testStackMiddlewares(@Locals("id") id: any, @Context("uid") uid: string): any {
    return {
      id: `${id}-${uid}`
    };
  }
}

export function testLocals(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;
  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [LocalsCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario 1: GET /rest/locals/scenario-1", () => {
    it("should call middleware and set a id in locals", async () => {
      const {body}: any = await request.get("/rest/locals/scenario-1").expect(200);

      expect(body.id).toEqual("local-10909-ctx-10909");
    });
  });
}
