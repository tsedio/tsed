import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {MemoryStorage} from "../storage/MemoryStorage";
import {CalendarsService} from "./CalendarsService";

describe("CalendarsService", () => {
  before(() => TestContext.create());
  before(() => TestContext.reset());

  describe("without IOC", () => {
    it("should do something", () => {
      expect(new CalendarsService(new MemoryStorage())).to.be.an.instanceof(CalendarsService);
    });
  });

  describe("with inject()", () => {
    it("should get the service from the inject method", inject([CalendarsService], (calendarsService: CalendarsService) => {
      expect(calendarsService).to.be.an.instanceof(CalendarsService);
    }));
  });

  describe("via TestContext to mock other service", () => {
    it("should get the service from InjectorService", async () => {
      // GIVEN
      const memoryStorage = {
        set: () => {
        },
        get: () => {
        }
      };

      // WHEN
      const calendarsService: CalendarsService = await TestContext.invoke(CalendarsService, [
        {provide: MemoryStorage, use: memoryStorage}
      ]);

      // THEN
      expect(calendarsService).to.be.an.instanceof(CalendarsService);
      // @ts-ignore
      expect(calendarsService.memoryStorage).to.equal(memoryStorage);
    });
  });
});
