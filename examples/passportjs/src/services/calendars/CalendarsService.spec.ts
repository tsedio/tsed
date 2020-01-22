import {inject} from "@tsed/testing";
import {expect} from "chai";
import {CalendarsService} from "./CalendarsService";

describe("CalendarsService", () => {
  it("should return calendar by ID", inject([CalendarsService], (calendarsService: CalendarsService) => {
    const item = calendarsService.findOne({});

    expect(calendarsService.findById(item._id)).to.deep.eq(item);
  }));
});
