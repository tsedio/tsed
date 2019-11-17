import {inject, TestContext} from "@tsed/testing";
import {EventsCtrl} from "./EventsCtrl";

describe("EventsCtrl", () => {
  before(() => TestContext.create());
  after(() => TestContext.reset());

  it("should be a EventsCtrl", inject([EventsCtrl], (eventsCtrl: EventsCtrl) => {
    eventsCtrl.should.be.instanceof(EventsCtrl);
  }));
});
