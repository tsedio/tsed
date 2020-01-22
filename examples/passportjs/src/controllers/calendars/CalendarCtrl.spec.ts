import {TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import {Calendar} from "../../models/Calendar";
import {User} from "../../models/User";
import {CalendarsService} from "../../services/calendars/CalendarsService";
import {CalendarCtrl} from "./CalendarCtrl";

describe("CalendarsCtrl", () => {
  beforeEach(() => TestContext.create());
  afterEach(() => TestContext.reset());

  describe(".get()", () => {
    it("should return a calendar", async () => {
      // GIVEN
      const calendar = new Calendar();
      const user = new User();
      user._id = "u1";

      const calendarsService = {
        findOne: Sinon.stub().resolves(calendar)
      };

      const calendarController: CalendarCtrl = TestContext.invoke(CalendarCtrl, [
        {
          provide: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      const result = await calendarController.get(user, "1");

      // THEN
      result.should.deep.equal(calendar);
      calendarsService.findOne.should.be.calledWithExactly({_id: "1", owner: user._id});
    });
    it("should throw error", async () => {
      // GIVEN
      const user = new User();
      user._id = "u1";
      const calendarsService = {
        findOne: Sinon.stub().resolves(undefined)
      };

      const calendarController: CalendarCtrl = TestContext.invoke(CalendarCtrl, [
        {
          provide: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      let actualError: any;
      try {
        await calendarController.get(user, "1");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.message.should.deep.eq("Calendar not found");
    });
  });
  describe(".create()", () => {
    it("should create a calendar", async () => {
      // GIVEN
      const calendar = new Calendar();
      calendar._id = "1";
      calendar.name = "name";

      const user = new User();
      user._id = "u1";

      const calendarsService = {
        create: Sinon.stub().resolves(calendar)
      };

      const calendarController: CalendarCtrl = TestContext.invoke(CalendarCtrl, [
        {
          provide: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      const result = await calendarController.create(user, {name: "name"});

      // THEN
      result.should.deep.equal(calendar);
      calendarsService.create.should.be.calledWithExactly({name: "name"});
    });
  });
  describe(".update()", () => {
    it("should return a calendar", async () => {
      // GIVEN
      const calendar = new Calendar();
      const user = new User();
      user._id = "u1";

      const calendarsService = {
        findOne: Sinon.stub().resolves(calendar),
        update: Sinon.stub().resolves(calendar)
      };

      const calendarController: CalendarCtrl = TestContext.invoke(CalendarCtrl, [
        {
          provide: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      const result = await calendarController.update(user, "1", {name: "name"});

      // THEN
      result.should.deep.equal(calendar);
      calendarsService.findOne.should.be.calledWithExactly({_id: "1", owner: user._id});
      calendarsService.update.should.be.calledWithExactly({_id: "1", name: "name"});
    });

    it("should throw error", async () => {
      // GIVEN
      const calendarsService = {
        findOne: Sinon.stub().resolves(undefined),
        update: Sinon.stub().resolves(undefined)
      };
      const user = new User();
      user._id = "u1";

      const calendarController: CalendarCtrl = TestContext.invoke(CalendarCtrl, [
        {
          provide: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      let actualError: any;
      try {
        await calendarController.update(user, "1", {name: "name"});
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.message.should.deep.eq("Calendar not found");
    });
  });
  describe(".remove()", () => {
    it("should return a removed calendar", async () => {
      // GIVEN
      const calendar = new Calendar();
      const user = new User();
      user._id = "u1";

      const calendarsService = {
        removeOne: Sinon.stub().resolves(calendar)
      };

      const calendarController: CalendarCtrl = TestContext.invoke(CalendarCtrl, [
        {
          provide: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      await calendarController.remove(user, "1");

      // THEN
      calendarsService.removeOne.should.be.calledWithExactly({_id: "1", owner: user._id});
    });

    it("should throw error", async () => {
      // GIVEN
      const user = new User();
      user._id = "u1";

      const calendarsService = {
        removeOne: Sinon.stub().resolves(undefined)
      };

      const calendarController: CalendarCtrl = TestContext.invoke(CalendarCtrl, [
        {
          provide: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      let actualError: any;
      try {
        await calendarController.remove(user, "1");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.message.should.deep.eq("Calendar not found");
    });
  });
  describe(".getAll()", () => {
    it("should return all calendars", async () => {
      // GIVEN
      const calendar = new Calendar();

      const calendarsService = {
        findAll: Sinon.stub().resolves([calendar])
      };

      const calendarController: CalendarCtrl = TestContext.invoke(CalendarCtrl, [
        {
          provide: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      const result = await calendarController.getAll("1", "name", "owner");

      // THEN
      result.should.deep.equal([calendar]);
      calendarsService.findAll.should.be.calledWithExactly({_id: "1", name: "name", owner: "owner"});
    });
  });
});
