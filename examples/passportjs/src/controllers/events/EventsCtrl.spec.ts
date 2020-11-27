import * as Sinon from "sinon";
import {Event} from "../../models/Event";
import {Task} from "../../models/Task";
import {CalendarEventsService} from "../../services/events/CalendarEventsService";
import {EventsCtrl} from "./EventsCtrl";
import {PlatformTest} from "@tsed/common";

describe("EventsCtrl", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe(".get()", () => {
    it("should return a event", async () => {
      // GIVEN
      const event = new Event();
      const calendarEventsService = {
        findById: Sinon.stub().resolves(event)
      };

      const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
        {
          token: CalendarEventsService,
          use: calendarEventsService
        }
      ]);

      // WHEN
      const result = await eventsCtrl.get("calendarId", "id");

      // THEN
      result.should.deep.equal(event);
      calendarEventsService.findById.should.be.calledWithExactly("id");
    });
    it("should throw error", async () => {
      // GIVEN
      const calendarEventsService = {
        findById: Sinon.stub().resolves(undefined)
      };

      const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
        {
          token: CalendarEventsService,
          use: calendarEventsService
        }
      ]);

      // WHEN
      let actualError: any;
      try {
        await eventsCtrl.get("calendarId", "1");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.message.should.deep.eq("Event not found");
    });
  });
  describe(".getTasks()", () => {
    it("should return a tasks event", async () => {
      // GIVEN
      const event = new Event();
      event.tasks = [
        new Task()
      ];

      const calendarEventsService = {
        findById: Sinon.stub().resolves(event)
      };

      const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
        {
          token: CalendarEventsService,
          use: calendarEventsService
        }
      ]);

      // WHEN
      const result = await eventsCtrl.getTasks("calendarId", "id");

      // THEN
      result.should.deep.equal(event.tasks);
    });
  });
  describe(".create()", () => {
    it("should create a event", async () => {
      // GIVEN
      const event = new Event();
      event.startDate = new Date();
      event.endDate = new Date();

      const calendarEventsService = {
        create: Sinon.stub().resolves(event)
      };

      const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
        {
          token: CalendarEventsService,
          use: calendarEventsService
        }
      ]);

      // WHEN
      const result = await eventsCtrl.create("calendarId", event);

      // THEN
      result.should.deep.equal(event);
      calendarEventsService.create.should.be.calledWithExactly({calendarId: "calendarId", ...event});
    });
  });
  describe(".update()", () => {
    it("should return a event", async () => {
      // GIVEN
      const event = new Event();
      event.startDate = new Date();
      event.endDate = new Date();

      const calendarEventsService = {
        update: Sinon.stub().resolves(event)
      };

      const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
        {
          token: CalendarEventsService,
          use: calendarEventsService
        }
      ]);

      // WHEN
      const result = await eventsCtrl.update("calendarId", "1", event);

      // THEN
      result.should.deep.equal(event);
      calendarEventsService.update.should.be.calledWithExactly({_id: "1", calendarId: "calendarId", ...event});
    });

    it("should throw error", async () => {
      // GIVEN
      const event = new Event();
      event.startDate = new Date();
      event.endDate = new Date();

      const calendarEventsService = {
        update: Sinon.stub().resolves(undefined)
      };

      const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
        {
          token: CalendarEventsService,
          use: calendarEventsService
        }
      ]);

      // WHEN
      let actualError: any;
      try {
        await eventsCtrl.update("calendarId", "1", event);
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.message.should.deep.eq("Event not found");
    });
  });
  describe(".remove()", () => {
    it("should return a removed event", async () => {
      // GIVEN
      const event = new Event();
      event.startDate = new Date();
      event.endDate = new Date();

      const calendarEventsService = {
        removeOne: Sinon.stub().resolves(event)
      };

      const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
        {
          token: CalendarEventsService,
          use: calendarEventsService
        }
      ]);

      // WHEN
      await eventsCtrl.remove("calendarId", "1");

      // THEN
      calendarEventsService.removeOne.should.be.calledWithExactly({_id: "1", calendarId: "calendarId"});
    });

    it("should throw error", async () => {
      // GIVEN
      const calendarEventsService = {
        removeOne: Sinon.stub().resolves(undefined)
      };

      const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
        {
          token: CalendarEventsService,
          use: calendarEventsService
        }
      ]);

      // WHEN
      let actualError: any;
      try {
        await eventsCtrl.remove("calendarId", "1");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.message.should.deep.eq("Event not found");
    });
  });
  describe(".getAll()", () => {
    it("should return all events", async () => {
      // GIVEN
      const event = new Event();
      const calendarEventsService = {
        findAll: Sinon.stub().resolves([event])
      };

      const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
        {
          token: CalendarEventsService,
          use: calendarEventsService
        }
      ]);

      // WHEN
      const result = await eventsCtrl.getAll("calendarId");

      // THEN
      result.should.deep.equal([event]);
      calendarEventsService.findAll.should.be.calledWithExactly({calendarId: "calendarId"});
    });
  });
});
