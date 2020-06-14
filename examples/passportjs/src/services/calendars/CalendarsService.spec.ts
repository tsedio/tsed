import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {CalendarsService} from "./CalendarsService";

describe("CalendarsService", () => {
  it("should return calendar by ID", PlatformTest.inject([CalendarsService], (calendarsService: CalendarsService) => {
    const item = calendarsService.findOne({});

    expect(calendarsService.findById(item._id)).to.deep.eq(item);
  }));
});
