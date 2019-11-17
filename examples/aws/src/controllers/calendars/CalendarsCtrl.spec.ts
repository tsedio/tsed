import {TestContext} from "@tsed/testing";
import * as Sinon from "Sinon";
import {CalendarsService} from "../../services/calendars/CalendarsService";
import {MemoryStorage} from "../../services/storage/MemoryStorage";
import {CalendarsCtrl} from "./CalendarsCtrl";
import {NotFound} from "ts-httpexceptions";

describe("CalendarsCtrl", () => {
  describe("get()", () => {
    describe("without IOC", () => {
      it("should do something", () => {
        const calendarsCtrl = new CalendarsCtrl(new CalendarsService(new MemoryStorage()));
        calendarsCtrl.should.an.instanceof(CalendarsCtrl);
      });
    });

    describe("via TestContext to mock other service", () => {
      before(() => TestContext.create());
      after(() => TestContext.reset());

      it("should return a result from mocked service", async () => {
        // GIVEN
        const calendarsService = {
          find: Sinon.stub().resolves({id: "1"})
        };

        const calendarsCtrl = await TestContext.invoke(CalendarsCtrl, [{
          provide: CalendarsService,
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
        before(() => TestContext.create());
        after(() => TestContext.reset());

        it("should return a result from mocked service", async () => {
          // GIVEN
          const calendarsService = {
            find: Sinon.stub().rejects({id: "1"})
          };

          const calendarsCtrl = await TestContext.invoke(CalendarsCtrl, [{
            provide: CalendarsService,
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
