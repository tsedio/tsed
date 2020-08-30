import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";
import {NotFoundMiddleware} from "../middlewares/NotFoundMiddleware";

export function testCustom404(options: PlatformTestOptions) {
  class CustomServer extends options.server {
    public $afterRoutesInit() {
      this.app.use(NotFoundMiddleware);
    }
  }

  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(
    PlatformTest.bootstrap(CustomServer, {
      ...options,
      mount: {
        "/rest": [],
      },
    })
  );

  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("Scenario 1: GET /", async () => {
    const response: any = await request.get("/").expect(404);

    expect(response.text).to.deep.eq("Custom 404 HTML PAGE");
  });
}
