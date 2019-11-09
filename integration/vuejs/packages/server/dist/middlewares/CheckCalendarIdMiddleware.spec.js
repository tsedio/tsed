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
const Sinon = require("sinon");
const chai_1 = require("chai");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const CalendarsService_1 = require("../services/calendars/CalendarsService");
const CheckCalendarIdMiddleware_1 = require("./CheckCalendarIdMiddleware");
describe("CheckCalendarIdMiddleware", () => {
    describe("when calendar isn\'t found", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should do nothing when calendar is found", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const calendarsService = {
                find: Sinon.stub().resolves({})
            };
            const middleware = yield testing_1.TestContext.invoke(CheckCalendarIdMiddleware_1.CheckCalendarIdMiddleware, [{
                    provide: CalendarsService_1.CalendarsService,
                    use: calendarsService
                }]);
            // WHEN
            const result = yield middleware.use("1");
            // THEN
            // @ts-ignore
            calendarsService.find.should.be.calledWithExactly("1");
            chai_1.expect(result).to.eq(undefined);
        }));
        it("should throw an error", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const calendarsService = {
                find: Sinon.stub().resolves()
            };
            const middleware = yield testing_1.TestContext.invoke(CheckCalendarIdMiddleware_1.CheckCalendarIdMiddleware, [{
                    provide: CalendarsService_1.CalendarsService,
                    use: calendarsService
                }]);
            // WHEN
            let actualError;
            try {
                yield middleware.use("1");
            }
            catch (er) {
                actualError = er;
            }
            // THEN
            // @ts-ignore
            calendarsService.find.should.be.calledWithExactly("1");
            actualError.should.instanceOf(ts_httpexceptions_1.NotFound);
            actualError.message.should.eq("Calendar not found");
        }));
    });
});
//# sourceMappingURL=CheckCalendarIdMiddleware.spec.js.map