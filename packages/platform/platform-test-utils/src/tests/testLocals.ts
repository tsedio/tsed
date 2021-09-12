import {Context, Controller, Get, Locals, Middleware, Next, PlatformContext, PlatformTest, Req, Request, Res, Use} from "@tsed/common";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

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

export function testLocals(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [LocalsCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario 1: GET /rest/locals/scenario-1", () => {
    it("should call middleware and set a id in locals", async () => {
      const {body}: any = await request.get("/rest/locals/scenario-1").expect(200);

      expect(body.id).to.equal("local-10909-ctx-10909");
    });
  });
}
