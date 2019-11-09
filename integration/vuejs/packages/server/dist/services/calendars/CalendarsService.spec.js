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
const MemoryStorage_1 = require("../storage/MemoryStorage");
const CalendarsService_1 = require("./CalendarsService");
describe("CalendarsService", () => {
    before(() => testing_1.TestContext.create());
    before(() => testing_1.TestContext.reset());
    describe("without IOC", () => {
        it("should do something", () => {
            chai_1.expect(new CalendarsService_1.CalendarsService(new MemoryStorage_1.MemoryStorage())).to.be.an.instanceof(CalendarsService_1.CalendarsService);
        });
    });
    describe("with inject()", () => {
        it("should get the service from the inject method", testing_1.inject([CalendarsService_1.CalendarsService], (calendarsService) => {
            chai_1.expect(calendarsService).to.be.an.instanceof(CalendarsService_1.CalendarsService);
        }));
    });
    describe("via TestContext to mock other service", () => {
        it("should get the service from InjectorService", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const memoryStorage = {
                set: () => {
                },
                get: () => {
                }
            };
            // WHEN
            const calendarsService = yield testing_1.TestContext.invoke(CalendarsService_1.CalendarsService, [
                { provide: MemoryStorage_1.MemoryStorage, use: memoryStorage }
            ]);
            // THEN
            chai_1.expect(calendarsService).to.be.an.instanceof(CalendarsService_1.CalendarsService);
            // @ts-ignore
            chai_1.expect(calendarsService.memoryStorage).to.equal(memoryStorage);
        }));
    });
});
//# sourceMappingURL=CalendarsService.spec.js.map