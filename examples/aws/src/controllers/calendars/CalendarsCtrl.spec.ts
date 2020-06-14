import {PlatformTest} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import * as Sinon from "sinon";
import {CalendarsService} from "../../services/calendars/CalendarsService";
import {MemoryStorage} from "../../services/storage/MemoryStorage";
import {CalendarsCtrl} from "./CalendarsCtrl";

describe("CalendarsCtrl", () => {
  describe("get()", () => {
    describe("without IOC", () => {
      it("should do something", () => {
        const calendarsCtrl = new CalendarsCtrl(new CalendarsService(new MemoryStorage()));
        calendarsCtrl.should.an.instanceof(CalendarsCtrl);
      });
    });

    describe("via PlatformTest to mock other service", () => {
      before(() => PlatformTest.create());
      after(() => PlatformTest.reset());

      it("should return a result from mocked service", async () => {
        // GIVEN
        const calendarsService = {
          find: Sinon.stub().resolves({id: "1"})
        };

        const calendarsCtrl = await PlatformTest.invoke(CalendarsCtrl, [{
          token: CalendarsService,
          use: calendarsService
        }]);

        // WHEN
        const result = await calendarsCtrl.get("1");

        // THEN
        result.should.deep.equal({id: "1"});
        calendarsService.find.should.be.calledWithExactly("1");

        calendarsCtrl.should.be.an.instanceof(CalendarsCtrl);
        calendarsCtrl.calendarsService.should.deep.equal(calendarsService);
      });
    });

    describe("when calendar isn\'t found", () => {
      it("should throw error", () => {
        before(() => PlatformTest.create());
        after(() => PlatformTest.reset());

        it("should return a result from mocked service", async () => {
          // GIVEN
          const calendarsService = {
            find: Sinon.stub().rejects({id: "1"})
          };

          const calendarsCtrl = await PlatformTest.invoke(CalendarsCtrl, [{
            token: CalendarsService,
            use: calendarsService
          }]);

          // WHEN
          let actualError;
          try {
            await calendarsCtrl.get("1");
          } catch (er) {
            actualError = er;
          }

          // THEN
          actualError.should.be.instanceof(NotFound);
          calendarsService.find.should.be.calledWithExactly("1");
        });
      });
    });
  });
});
