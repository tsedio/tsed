import {PlatformTest} from "@tsed/common";
import {EventsCtrl} from "./EventsCtrl";

describe("EventsCtrl", () => {
  before(() => PlatformTest.create());
  after(() => PlatformTest.reset());

  it("should be a EventsCtrl", PlatformTest.inject([EventsCtrl], (eventsCtrl: EventsCtrl) => {
    eventsCtrl.should.be.instanceof(EventsCtrl);
  }));
});
