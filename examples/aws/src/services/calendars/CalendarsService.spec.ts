import {expect} from "chai";
import {MemoryStorage} from "../storage/MemoryStorage";
import {CalendarsService} from "./CalendarsService";
import { PlatformTest } from "@tsed/common";

describe("CalendarsService", () => {
  before(() => PlatformTest.create());
  before(() => PlatformTest.reset());

  describe("without IOC", () => {
    it("should do something", () => {
      expect(new CalendarsService(new MemoryStorage())).to.be.an.instanceof(CalendarsService);
    });
  });

  describe("with inject()", () => {
    it("should get the service from the inject method", PlatformTest.inject([CalendarsService], (calendarsService: CalendarsService) => {
      expect(calendarsService).to.be.an.instanceof(CalendarsService);
    }));
  });

  describe("via PlatformTest to mock other service", () => {
    it("should get the service from InjectorService", async () => {
      // GIVEN
      const memoryStorage = {
        set: () => {
        },
        get: () => {
        }
      };

      const locals = new Map<any, any>();
      locals.set(MemoryStorage, memoryStorage);

      // WHEN
      const calendarsService: CalendarsService = await PlatformTest.invoke(CalendarsService, [
        {token: MemoryStorage, use: memoryStorage}
      ]);

      // THEN
      expect(calendarsService).to.be.an.instanceof(CalendarsService);
      // @ts-ignore
      expect(calendarsService.memoryStorage).to.equal(memoryStorage);
    });
  });
});
