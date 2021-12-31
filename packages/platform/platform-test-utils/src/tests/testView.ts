import {Controller, Get, Locals, Middleware, PlatformTest, UseBefore} from "@tsed/common";
import {expect} from "chai";
import {EOL} from "os";
import SuperTest from "supertest";
import {View} from "@tsed/platform-views";
import {PlatformTestOptions} from "../interfaces";

@Middleware()
class LocalsMiddleware {
  use(@Locals() locals: any) {
    locals.localID = "local-10909";
  }
}

@Controller("/views")
class ViewCtrl {
  @Get("/scenario-1")
  @UseBefore(LocalsMiddleware)
  @View("view.ejs", {opts: "opts"})
  testScenario1() {
    return {
      world: "world"
    };
  }

  @Get("/scenario-2")
  @View("view", {opts: "opts"}) // missing extension
  testScenario2() {
    return {
      world: "world"
    };
  }
}

export function testView(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [ViewCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario1: GET /rest/views/scenario-1", () => {
    it("should render a view", async () => {
      const response = await request.get("/rest/views/scenario-1").expect(200);

      expect(response.headers["content-type"]).to.deep.equal("text/html; charset=utf-8");
      expect(response.text).to.deep.equal(`<p>Hello world with opts and ID local-10909</p>${EOL}`);
    });
  });

  describe("Scenario2: GET /rest/views/scenario-2", () => {
    it("should throw an error when extension is not defined", async () => {
      const response = await request.get("/rest/views/scenario-2").expect(500);

      expect(response.body.name).to.deep.equal("TEMPLATE_RENDER_ERROR");
      expect(response.body.message).to.contain("Template rendering error: ViewCtrl.testScenario2()");
      expect(response.body.status).to.eq(500);
    });
  });
}
