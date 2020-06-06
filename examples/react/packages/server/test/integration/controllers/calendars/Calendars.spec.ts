import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Calendars", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  before(PlatformTest.bootstrap(Server));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(response.body).to.be.an("array");
      expect(response.body).to.deep.eq(
        [
          {id: "1", name: "Sexton Berg"},
          {id: "2", name: "Etta Gonzalez"},
          {id: "3", name: "Hall Leon"},
          {id: "4", name: "Gentry Rowe"},
          {id: "5", name: "Janelle Adams"},
          {id: "6", name: "Smith Norris"},
          {id: "7", name: "Robertson Crane"}
        ]);
    });
  });
});
