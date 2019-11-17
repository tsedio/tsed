import {TestContext} from "@tsed/testing";
import {EventsCtrl} from "./EventsCtrl";
import {expect} from "chai";

describe("EventsCtrl", () => {
  describe("get()", () => {

    before(() => TestContext.create());
    after(() => TestContext.reset());

    it("should return a result from mocked service", async () => {
      // GIVEN
      const eventsCtrl: EventsCtrl = await TestContext.invoke(EventsCtrl, []);

      // WHEN
      const result = await eventsCtrl.get("2", "1");

      // THEN
      result.should.deep.equal({
        "calendarId": "2",
        "endDate": "2017-07-01",
        "id": "1",
        "name": "QUAILCOM",
        "startDate": "2017-07-01",
        "tasks": [
          {
            "name": "Task n°1",
            "percent": 0
          },
          {
            "name": "Task n°2",
            "percent": 0
          }
        ]
      });
    });
  });
  describe("getTasks()", () => {
    before(() => TestContext.create());
    after(() => TestContext.reset());

    it("should return a result from mocked service", async () => {
      // GIVEN
      const eventsCtrl: EventsCtrl = await TestContext.invoke(EventsCtrl, []);

      // WHEN
      const result = await eventsCtrl.getTasks("2", "1");

      // THEN
      result.should.deep.equal([
        {
          "name": "Task n°1",
          "percent": 0,
        },
        {
          "name": "Task n°2",
          "percent": 0
        }
      ]);
    });
  });
  describe("save()", () => {
    before(() => TestContext.create());
    after(() => TestContext.reset());

    it("should return a result from mocked service", async () => {
      // GIVEN
      const eventsCtrl: EventsCtrl = await TestContext.invoke(EventsCtrl, []);
      const calendarId = "1";
      const startDate = "startDate";
      const endDate = "endDate";
      const name = "name";

      // WHEN
      const result = await eventsCtrl.save(calendarId, startDate, endDate, name);
      // THEN

      result.should.deep.equal({
        "calendarId": "1",
        "endDate": "endDate",
        "id": "6",
        "name": "name",
        "startDate": "startDate"
      });
    });
  });
  describe("update()", () => {
    before(() => TestContext.create());
    after(() => TestContext.reset());

    it("should return a result from mocked service", async () => {
      // GIVEN
      const eventsCtrl: EventsCtrl = await TestContext.invoke(EventsCtrl, []);
      const calendarId = "2";
      const startDate = "startDate";
      const endDate = "endDate";
      const name = "name";
      const id = "7";

      // WHEN
      const result = await eventsCtrl.update(calendarId, id, startDate, endDate, name);

      // THEN
      result.should.deep.equal({
        "calendarId": "2",
        "endDate": "name",
        "id": "7",
        "name": "name",
        "startDate": "name",
        "tasks": [
          {
            "name": "Task n°1",
            "percent": 0
          },
          {
            "name": "Task n°2",
            "percent": 0
          }
        ]
      });
    });
  });
  describe("getEvents()", () => {
    before(() => TestContext.create());
    after(() => TestContext.reset());

    it("should return a result from mocked service", async () => {
      // GIVEN
      const eventsCtrl: EventsCtrl = await TestContext.invoke(EventsCtrl, []);
      const calendarId = "3";

      // WHEN
      const result = await eventsCtrl.getEvents(calendarId);

      // THEN
      result.should.deep.equal([]);
    });
  });
  describe("delete()", () => {
    before(() => TestContext.create());
    after(() => TestContext.reset());

    it("should return a result from mocked service", async () => {
      // GIVEN
      const eventsCtrl: EventsCtrl = await TestContext.invoke(EventsCtrl, []);
      const calendarId = "2";
      const id = "7";

      // WHEN
      const result = await eventsCtrl.remove(calendarId, id);

      // THEN
      expect(result).to.eq(undefined);
    });
  });
});
