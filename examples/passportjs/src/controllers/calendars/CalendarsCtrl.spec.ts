import {ControllerService} from "@tsed/common";
import {inject} from "@tsed/testing";
import {expect, Sinon} from "../../../test/tools";
import {CalendarsService} from "../../services/calendars/CalendarsService";
import {MemoryStorage} from "../../services/storage/MemoryStorage";
import {CalendarsCtrl} from "./CalendarsCtrl";


describe("CalendarsCtrl", () => {

    describe("without IOC", () => {
        before(() => {
            this.calendarsCtrl = new CalendarsCtrl(new CalendarsService(new MemoryStorage()));
        });

        it("should do something", () => {
            expect(this.calendarsCtrl).to.be.an.instanceof(CalendarsCtrl);
        });
    });

    describe("via InjectorService to mock other service", () => {
        before(inject([ControllerService], (controllerService: ControllerService) => {

            this.calendarsService = {
                find: Sinon.stub().returns(Promise.resolve({id: "1"}))
            };

            const locals = new Map<any, any>();
            locals.set(CalendarsService, this.calendarsService);

            this.CalendarsCtrl = controllerService.invoke<CalendarsCtrl>(CalendarsCtrl, locals);
            this.result = this.CalendarsCtrl.get("1");
            return this.result;
        }));

        it("should get the service from InjectorService", () => {
            expect(this.CalendarsCtrl).to.be.an.instanceof(CalendarsCtrl);
        });

        it("should have a fake memoryStorage", () => {
            expect(this.CalendarsCtrl.calendarsService).to.equal(this.calendarsService);
        });

        it("should have been called the CalendarService.find() method", () => {
            this.calendarsService.find.should.be.calledWithExactly("1");
        });

        it("should return the calendar", () => {
            return this.result.should.eventually.deep.equal({id: "1"});
        });
    });

});