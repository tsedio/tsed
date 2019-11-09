"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@tsed/testing");
const chai_1 = require("chai");
const Sinon = require("sinon");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const Calendar_1 = require("../../models/Calendar");
const CalendarsService_1 = require("../../services/calendars/CalendarsService");
const MemoryStorage_1 = require("../../services/storage/MemoryStorage");
const CalendarsCtrl_1 = require("./CalendarsCtrl");
describe("CalendarCtrl", () => {
    describe("get()", () => {
        describe("without IOC", () => {
            it("should do something", () => {
                const calendarsCtrl = new CalendarsCtrl_1.CalendarsCtrl(new CalendarsService_1.CalendarsService(new MemoryStorage_1.MemoryStorage()));
                calendarsCtrl.should.an.instanceof(CalendarsCtrl_1.CalendarsCtrl);
            });
        });
        describe("via TestContext to mock other service", () => {
            before(() => testing_1.TestContext.create());
            after(() => testing_1.TestContext.reset());
            it("should return a result from mocked service", () => __awaiter(void 0, void 0, void 0, function* () {
                // GIVEN
                const calendarsService = {
                    find: Sinon.stub().resolves({ id: "1" })
                };
                const calendarsCtrl = yield testing_1.TestContext.invoke(CalendarsCtrl_1.CalendarsCtrl, [{
                        provide: CalendarsService_1.CalendarsService,
                        use: calendarsService
                    }]);
                // WHEN
                const result = yield calendarsCtrl.get("1");
                // THEN
                result.should.deep.equal({ id: "1" });
                calendarsService.find.should.be.calledWithExactly("1");
                calendarsCtrl.should.be.an.instanceof(CalendarsCtrl_1.CalendarsCtrl);
                calendarsCtrl.calendarsService.should.deep.equal(calendarsService);
            }));
        });
        describe("when calendar isn\'t found", () => {
            before(() => testing_1.TestContext.create());
            after(() => testing_1.TestContext.reset());
            it("should throw error", () => __awaiter(void 0, void 0, void 0, function* () {
                // GIVEN
                const calendarsService = {
                    find: Sinon.stub().resolves()
                };
                const calendarsCtrl = yield testing_1.TestContext.invoke(CalendarsCtrl_1.CalendarsCtrl, [{
                        provide: CalendarsService_1.CalendarsService,
                        use: calendarsService
                    }]);
                // WHEN
                let actualError;
                try {
                    yield calendarsCtrl.get("1");
                }
                catch (er) {
                    actualError = er;
                }
                // THEN
                // @ts-ignore
                calendarsCtrl.calendarsService.should.deep.eq(calendarsService);
                calendarsService.find.should.be.calledWithExactly("1");
                actualError.should.instanceOf(ts_httpexceptions_1.NotFound);
                actualError.message.should.eq("Calendar not found");
            }));
        });
    });
    describe("save()", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should return saved data", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const calendar = new Calendar_1.Calendar();
            calendar.id = "id";
            calendar.name = "name";
            calendar.owner = "owner";
            const calendarsService = {
                create: Sinon.stub().resolves(calendar)
            };
            const calendarsCtrl = yield testing_1.TestContext.invoke(CalendarsCtrl_1.CalendarsCtrl, [{
                    provide: CalendarsService_1.CalendarsService,
                    use: calendarsService
                }]);
            // WHEN
            const result = yield calendarsCtrl.save({ name: "name" });
            // THEN
            calendarsService.create.should.be.calledWithExactly({ name: "name" });
            result.should.deep.eq(calendar);
        }));
    });
    describe("update()", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should return update data", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const calendar = new Calendar_1.Calendar();
            calendar.id = "id";
            calendar.name = "name";
            calendar.owner = "owner";
            const calendarsService = {
                update: Sinon.stub().resolves(calendar)
            };
            const calendarsCtrl = yield testing_1.TestContext.invoke(CalendarsCtrl_1.CalendarsCtrl, [{
                    provide: CalendarsService_1.CalendarsService,
                    use: calendarsService
                }]);
            // WHEN
            const result = yield calendarsCtrl.update("id", { name: "name" });
            // THEN
            calendarsService.update.should.be.calledWithExactly({ id: "id", name: "name" });
            result.should.deep.eq(calendar);
        }));
    });
    describe("remove()", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should return update data", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const calendarsService = {
                remove: Sinon.stub().resolves()
            };
            const calendarsCtrl = yield testing_1.TestContext.invoke(CalendarsCtrl_1.CalendarsCtrl, [{
                    provide: CalendarsService_1.CalendarsService,
                    use: calendarsService
                }]);
            // WHEN
            const result = yield calendarsCtrl.remove("id");
            // THEN
            calendarsService.remove.should.be.calledWithExactly("id");
            chai_1.expect(result).to.eq(undefined);
        }));
    });
});
//# sourceMappingURL=CalendarsCtrl.spec.js.map