import {ExpressApplication} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../Server";

describe("Rest", () => {
  // bootstrap your Server to load all endpoints before run your test
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(TestMongooseContext.bootstrap(Server)); // Create a server with mocked database
  before(TestContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
    request = SuperTest(expressApplication);
  }));

  after(TestMongooseContext.reset); // reset database and injector

  describe("GET /rest/calendars", () => {
    it("should do something", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(response.body).to.be.an("array");
    });
  });
});
