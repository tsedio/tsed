import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {CalendarsService} from "../../services/calendars/CalendarsService";
import {MemoryStorage} from "../../services/storage/MemoryStorage";
import {CalendarCtrl} from "./CalendarCtrl";

describe("CalendarsCtrl", () => {
  describe("without IOC", () => {
    it("should do something", () => {
      // GIVEN
      const calendarsCtrl = new CalendarCtrl(new CalendarsService(new MemoryStorage()));

      expect(calendarsCtrl).to.be.an.instanceof(CalendarCtrl);
    });
  });

  describe("with mocking dependencies", () => {
    before(() => TestContext.create());
    after(() => TestContext.reset());

    it("should return the expected result", () => {
      // GIVEN
      const calendarsService = {
        find: Sinon.stub().returns(Promise.resolve({id: "1"}))
      };

      const calendarController = TestContext.invoke(CalendarCtrl, [
        {provide: CalendarsService, use: calendarsService}
      ]);

      // WHEN
      const result = calendarController.get("1");

      // THEN
      result.should.eventually.deep.equal({id: "1"});
      calendarsService.find.should.be.calledWithExactly("1");
      expect(calendarController.calendarsService).to.equal(calendarsService);
    });
  });
});
