import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import * as SuperTest from "supertest";

import {Server} from "../Server";

describe("Rest", () => {
  // bootstrap your Server to load all endpoints before run your test
  let request: SuperTest.Agent;

  before(TestMongooseContext.bootstrap(Server, {adapter: PlatformExpress})); // Create a server with mocked database
  before((done) => {
    request = SuperTest(PlatformTest.callback());
    done();
  });

  after(TestMongooseContext.reset); // reset database and injector

  describe("GET /rest/calendars", () => {
    it("should do something", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(response.body).to.be.an("array");
    });
  });
});
