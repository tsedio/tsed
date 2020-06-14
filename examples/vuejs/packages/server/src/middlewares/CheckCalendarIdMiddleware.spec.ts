import {PlatformTest} from "@tsed/common";
import * as Sinon from "sinon";
import {expect} from "chai";
import {NotFound} from "@tsed/exceptions";
import {CalendarsService} from "../services/calendars/CalendarsService";
import {CheckCalendarIdMiddleware} from "./CheckCalendarIdMiddleware";

describe("CheckCalendarIdMiddleware", () => {
  describe("when calendar isn\'t found", () => {
    before(() => PlatformTest.create());
    after(() => PlatformTest.reset());

    it("should do nothing when calendar is found", async () => {
      // GIVEN
      const calendarsService = {
        find: Sinon.stub().resolves({})
      };

      const middleware: CheckCalendarIdMiddleware = await PlatformTest.invoke(CheckCalendarIdMiddleware, [{
        token: CalendarsService,
        use: calendarsService
      }]);

      // WHEN
      const result = await middleware.use("1");
      // THEN
      // @ts-ignore
      calendarsService.find.should.be.calledWithExactly("1");
      expect(result).to.eq(undefined);
    });
    it("should throw an error", async () => {
      // GIVEN
      const calendarsService = {
        find: Sinon.stub().resolves()
      };

      const middleware: CheckCalendarIdMiddleware = await PlatformTest.invoke(CheckCalendarIdMiddleware, [{
        token: CalendarsService,
        use: calendarsService
      }]);

      // WHEN
      let actualError;
      try {
        await middleware.use("1");
      } catch (er) {
        actualError = er;
      }
      // THEN
      // @ts-ignore
      calendarsService.find.should.be.calledWithExactly("1");
      actualError.should.instanceOf(NotFound);
      actualError.message.should.eq("Calendar not found");
    });
  });
});
