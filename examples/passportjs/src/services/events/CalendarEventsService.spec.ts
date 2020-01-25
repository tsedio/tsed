import {inject} from "@tsed/testing";
import {expect} from "chai";
import {CalendarEventsService} from "./CalendarEventsService";

describe("CalendarEventsService", () => {
  it("should return calendar by ID", inject([CalendarEventsService], (calendarEventsService: CalendarEventsService) => {
    const item = calendarEventsService.findOne({});

    expect(calendarEventsService.findById(item._id)).to.deep.eq(item);
  }));
});
