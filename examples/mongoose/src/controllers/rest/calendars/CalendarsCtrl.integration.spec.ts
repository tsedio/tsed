import {PlatformTest} from "@tsed/common";
import {isArray} from "@tsed/core";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import * as SuperTest from "supertest";
import {Server} from "../../../Server";

async function getCalendarFixture(request: SuperTest.SuperTest<SuperTest.Test>): Promise<any> {
  const response = await request.get("/rest/calendars").expect(200);

  return response.body[0];
}

describe("Calendars", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  beforeAll(TestMongooseContext.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(TestMongooseContext.reset);

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(isArray(response.body)).toBe(true);
    });
  });

  describe("GET /rest/calendars/:id", () => {
    it("should return all calendars", async () => {
      // GIVEN
      const calendar = await getCalendarFixture(request);
      // WHEN
      const response = await request.get(`/rest/calendars/${calendar.id}`).expect(200);

      expect(response.body.id).toEqual(calendar.id);
    });

    it("should return a 400 when the id has the wrong format", async () => {
      // WHEN
      const response = await request.get(`/rest/calendars/1`).expect(400);

      expect(response.body).toEqual({
        name: "AJV_VALIDATION_ERROR",
        message: 'Bad request on parameter "request.path.id".\nValue should match pattern "^[0-9a-fA-F]{24}$". Given value: "1"',
        status: 400,
        errors: [
          {
            data: "1",
            keyword: "pattern",
            dataPath: "",
            schemaPath: "#/pattern",
            params: {pattern: "^[0-9a-fA-F]{24}$"},
            message: 'should match pattern "^[0-9a-fA-F]{24}$"'
          }
        ]
      });
    });

    it("should return a 404", async () => {
      // WHEN
      const response = await request.get(`/rest/calendars/5ce4ee471495836c5e2e4cb0`).expect(404);

      expect(response.body).toEqual({
        name: "NOT_FOUND",
        message: "Calendar not found",
        status: 404,
        errors: []
      });
    });
  });

  describe("PUT /rest/calendars/:id", () => {
    it("should  throw a bad request when payload is empty", async () => {
      // GIVEN
      const calendar = await getCalendarFixture(request);

      // WHEN
      const response = await request.put(`/rest/calendars/${calendar.id}`).expect(400);

      expect(response.body).toEqual({
        name: "AJV_VALIDATION_ERROR",
        message: 'Bad request on parameter "request.body".\nCalendar should have required property \'name\'. Given value: "undefined"',
        status: 400,
        errors: [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: {missingProperty: "name"},
            message: "should have required property 'name'",
            modelName: "Calendar"
          }
        ]
      });
    });

    it("should update the calendar", async () => {
      // GIVEN
      const calendar = await getCalendarFixture(request);

      // WHEN
      const response = await request
        .put(`/rest/calendars/${calendar.id}`)
        .send({
          ...calendar,
          name: "New name"
        })
        .expect(200);

      expect(response.body).toEqual({
        ...calendar,
        name: "New name"
      });
    });
  });

  describe("POST /rest/calendars", () => {
    it("should throw a bad request when payload is empty", async () => {
      // WHEN
      const response = await request.post(`/rest/calendars`).expect(400);

      expect(response.body).toEqual({
        name: "AJV_VALIDATION_ERROR",
        message: 'Bad request on parameter "request.body".\nCalendar should have required property \'name\'. Given value: "undefined"',
        status: 400,
        errors: [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: {missingProperty: "name"},
            message: "should have required property 'name'",
            modelName: "Calendar"
          }
        ]
      });
    });

    it("should add and delete a calendar", async () => {
      // WHEN
      const response = await request
        .post(`/rest/calendars`)
        .send({
          name: "New name"
        })
        .expect(201);

      expect(response.body.name).toEqual("New name");

      await request.delete(`/rest/calendars/${response.body.id}`).expect(204);
    });
  });
});
