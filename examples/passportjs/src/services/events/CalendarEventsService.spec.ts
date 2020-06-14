import {expect} from "chai";
import {CalendarEventsService} from "./CalendarEventsService";
import {PlatformTest} from "@tsed/common";

describe("CalendarEventsService", () => {
  it("should return calendar by ID", PlatformTest.inject([CalendarEventsService], (calendarEventsService: CalendarEventsService) => {
    const item = calendarEventsService.findOne({});

    expect(calendarEventsService.findById(item._id)).to.deep.eq(item);
  }));
});
