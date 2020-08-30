import {Context, Controller, Get, Locals, Next, PlatformTest, Req, Request, Res, Use} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

function middleware(request: Req, response: Res, next: Next) {
  request["user"] = 1;
  response.locals.id = "local-10909";
  request.ctx.set("uid", "ctx-10909");

  next();
}

@Controller("/locals")
class LocalsCtrl {
  @Get("/scenario-1")
  @Use(middleware)
  public testStackMiddlewares(@Request("user") user: any, @Locals("id") id: any, @Context("uid") uid: string): any {
    return {
      id: `${user}-${id}-${uid}`,
    };
  }
}

export function testLocals(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [LocalsCtrl],
      },
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario 1: GET /rest/locals/scenario-1", () => {
    it("should call middleware and set a id in locals", async () => {
      const {body}: any = await request.get("/rest/locals/scenario-1").expect(200);

      expect(body.id).to.equal("1-local-10909-ctx-10909");
    });
  });
}
