import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {MemoryStorage} from "../storage/MemoryStorage";
import {CalendarsService} from "./CalendarsService";

describe("CalendarsService", () => {
  describe("without IOC", () => {
    it("should do something", () => {
      const calendarsService = new CalendarsService(new MemoryStorage());

      expect(calendarsService).to.be.an.instanceof(CalendarsService);
    });
  });

  describe("with inject()", () => {
    it("should get the service from the inject method", inject([CalendarsService], (calendarsService: CalendarsService) => {
      expect(calendarsService).to.be.an.instanceof(CalendarsService);
    }));
  });

  describe("via InjectorService to mock other service", () => {
    before(() => TestContext.create());
    after(() => TestContext.reset());
    before(() => {
    });

    it("should invoke a calendarService with a fake memoryStorage", () => {
      // GIVEN
      const memoryStorage = {
        set: () => {
        },
        get: () => {
        }
      };

      // WHEN
      const calendarsService = TestContext.invoke(CalendarsService, [
        {provide: MemoryStorage, use: memoryStorage}
      ]);

      // THEN
      expect(calendarsService.memoryStorage).to.equal(memoryStorage);
      expect(calendarsService).to.be.an.instanceof(CalendarsService);
    });
  });
});
