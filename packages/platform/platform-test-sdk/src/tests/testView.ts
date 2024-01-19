import {Controller, Get, Locals, Middleware, PlatformTest, UseBefore} from "@tsed/common";
import {EOL} from "os";
import SuperTest from "supertest";
import {View} from "@tsed/platform-views";
import {PlatformTestingSdkOpts} from "../interfaces";

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

export function testView(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [ViewCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario1: GET /rest/views/scenario-1", () => {
    it("should render a view", async () => {
      const response = await request.get("/rest/views/scenario-1").expect(200);

      expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
      expect(response.text).toEqual(`<p>Hello world with opts and ID local-10909</p>${EOL}`);
    });
  });

  describe("Scenario2: GET /rest/views/scenario-2", () => {
    it("should throw an error when extension is not defined", async () => {
      const response = await request.get("/rest/views/scenario-2").expect(500);

      expect(response.body.name).toEqual("TEMPLATE_RENDER_ERROR");
      expect(response.body.message).toContain("Template rendering error: ViewCtrl.testScenario2()");
      expect(response.body.status).toEqual(500);
    });
  });
}
