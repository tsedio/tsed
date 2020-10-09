import {AcceptMime, Controller, HeaderParams, PlatformTest, Post} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

@Controller("/accept-mime")
class TestAcceptMimeCtrl {
  @Post("/scenario-1")
  @AcceptMime("application/json")
  scenario1(@HeaderParams("Accept") accept: string) {
    return {
      accept
    };
  }
}

export function testAcceptMime(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestAcceptMimeCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);
  describe("Scenario 1: POST /rest/accept-mime/scenario-1", () => {
    it('should return a 200 response when Accept header match with @AcceptMime("application/json")', async () => {
      const response = await request
        .post("/rest/accept-mime/scenario-1")
        .set({
          Accept: "application/json"
        })
        .expect(200);

      expect(response.body).to.deep.equal({
        accept: "application/json"
      });
    });
    it('should return a 406 response when Accept header doesn\'t match with @AcceptMime("application/json")', async () => {
      const response = await request
        .post("/rest/accept-mime/scenario-1")
        .set({
          Accept: "application/xml"
        })
        .expect(406);

      expect(response.body).to.deep.equal({
        name: "NOT_ACCEPTABLE",
        message: "You must accept content-type application/json",
        status: 406,
        errors: []
      });
    });
  });
}
