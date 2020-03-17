import {ExpressApplication} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../src/Server";

async function getCalendar(request: SuperTest.SuperTest<SuperTest.Test>): Promise<any> {
  const response = await request.get("/rest/calendars").expect(200);

  return response.body[0];
}

describe("Calendars", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  before(TestMongooseContext.bootstrap(Server));
  before(TestMongooseContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
    request = SuperTest(expressApplication);
  }));
  after(TestMongooseContext.reset);

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(response.body).to.be.an("array");
    });
  });

  describe("GET /rest/calendars/:id", () => {
    it("should return all calendars", async () => {
      // GIVEN
      const calendar = await getCalendar(request);

      // WHEN
      const response = await request.get(`/rest/calendars/${calendar.id}`).expect(200);

      expect(response.body).to.be.an("object");
      expect(response.body.id).to.eq(calendar.id);
    });

    it("should return a 400 when the id has the wrong format", async () => {
      // WHEN
      const response = await request.get(`/rest/calendars/1`).expect(400);

      expect(response.text).to.eq(`Cast to ObjectId failed for value "1" at path "_id" for model "Calendar"`);
    });

    it("should return a 404", async () => {
      // WHEN
      const response = await request.get(`/rest/calendars/5ce4ee471495836c5e2e4cb0`).expect(404);

      expect(response.text).to.eq(`Calendar not found`);
    });
  });

  describe("POST /rest/calendars", () => {
    it("should  throw a bad request when payload is empty", async () => {
      // GIVEN
      const calendar = await getCalendar(request);

      // WHEN
      const response = await request.post(`/rest/calendars/${calendar.id}`).expect(400);

      expect(response.text).to.eq("Property name on class Calendar is required. Given value: undefined");
    });

    it("should update the calendar", async () => {
      // GIVEN
      const calendar = await getCalendar(request);

      // WHEN
      const response = await request.post(`/rest/calendars/${calendar.id}`)
        .send({
          ...calendar,
          name: "New name"
        })
        .expect(200);

      expect(response.body).to.deep.eq({
        ...calendar,
        name: "New name"
      });
    });
  });

  describe("PUT /rest/calendars", () => {
    it("should throw a bad request when payload is empty", async () => {
      // WHEN
      const response = await request.put(`/rest/calendars`).expect(400);

      expect(response.text).to.eq("Property name on class Calendar is required. Given value: undefined");
    });

    it("should add and delete a calendar", async () => {
      // WHEN
      const response = await request.put(`/rest/calendars`)
        .send({
          name: "New name"
        })
        .expect(201);

      expect(response.body).to.deep.include({
        name: "New name"
      });

      await request.delete(`/rest/calendars/${response.body.id}`).expect(204);
    });
  });
});
