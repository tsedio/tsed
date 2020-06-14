import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Calendars", () => {
  let agent: SuperTest.SuperTest<SuperTest.Test>;
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  before(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    const app = PlatformTest.callback();
    agent = SuperTest.agent(app);
    request = SuperTest(app);
    await agent
      .post("/rest/auth/login")
      .send({email: "amy.riley@undefined.io", password: "583538ea97489c137ad54db5"})
      .expect(200);
  });
  after(() => PlatformTest.reset());

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars with login process", async () => {
      const response = await agent.get("/rest/calendars").expect(200);

      expect(response.body).to.be.an("array");
    });

    it("should fail when the user is not authenticated", async () => {
      const response = await request.get("/rest/calendars").expect(401);

      expect(response.text).to.eq("Unauthorized");
    });
  });
});
