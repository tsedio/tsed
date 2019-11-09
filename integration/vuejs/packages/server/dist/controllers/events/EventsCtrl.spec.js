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
const EventsCtrl_1 = require("./EventsCtrl");
const chai_1 = require("chai");
describe("EventsCtrl", () => {
    describe("get()", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should return a result from mocked service", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const eventsCtrl = yield testing_1.TestContext.invoke(EventsCtrl_1.EventsCtrl, []);
            // WHEN
            const result = yield eventsCtrl.get("2", "1");
            // THEN
            result.should.deep.equal({
                "calendarId": "2",
                "endDate": "2017-07-01",
                "id": "1",
                "name": "QUAILCOM",
                "startDate": "2017-07-01",
                "tasks": [
                    {
                        "name": "Task n°1",
                        "percent": 0
                    },
                    {
                        "name": "Task n°2",
                        "percent": 0
                    }
                ]
            });
        }));
    });
    describe("getTasks()", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should return a result from mocked service", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const eventsCtrl = yield testing_1.TestContext.invoke(EventsCtrl_1.EventsCtrl, []);
            // WHEN
            const result = yield eventsCtrl.getTasks("2", "1");
            // THEN
            result.should.deep.equal([
                {
                    "name": "Task n°1",
                    "percent": 0,
                },
                {
                    "name": "Task n°2",
                    "percent": 0
                }
            ]);
        }));
    });
    describe("save()", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should return a result from mocked service", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const eventsCtrl = yield testing_1.TestContext.invoke(EventsCtrl_1.EventsCtrl, []);
            const calendarId = "1";
            const startDate = "startDate";
            const endDate = "endDate";
            const name = "name";
            // WHEN
            const result = yield eventsCtrl.save(calendarId, startDate, endDate, name);
            // THEN
            result.should.deep.equal({
                "calendarId": "1",
                "endDate": "endDate",
                "id": "6",
                "name": "name",
                "startDate": "startDate"
            });
        }));
    });
    describe("update()", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should return a result from mocked service", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const eventsCtrl = yield testing_1.TestContext.invoke(EventsCtrl_1.EventsCtrl, []);
            const calendarId = "2";
            const startDate = "startDate";
            const endDate = "endDate";
            const name = "name";
            const id = "7";
            // WHEN
            const result = yield eventsCtrl.update(calendarId, id, startDate, endDate, name);
            // THEN
            result.should.deep.equal({
                "calendarId": "2",
                "endDate": "name",
                "id": "7",
                "name": "name",
                "startDate": "name",
                "tasks": [
                    {
                        "name": "Task n°1",
                        "percent": 0
                    },
                    {
                        "name": "Task n°2",
                        "percent": 0
                    }
                ]
            });
        }));
    });
    describe("getEvents()", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should return a result from mocked service", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const eventsCtrl = yield testing_1.TestContext.invoke(EventsCtrl_1.EventsCtrl, []);
            const calendarId = "3";
            // WHEN
            const result = yield eventsCtrl.getEvents(calendarId);
            // THEN
            result.should.deep.equal([]);
        }));
    });
    describe("delete()", () => {
        before(() => testing_1.TestContext.create());
        after(() => testing_1.TestContext.reset());
        it("should return a result from mocked service", () => __awaiter(void 0, void 0, void 0, function* () {
            // GIVEN
            const eventsCtrl = yield testing_1.TestContext.invoke(EventsCtrl_1.EventsCtrl, []);
            const calendarId = "2";
            const id = "7";
            // WHEN
            const result = yield eventsCtrl.remove(calendarId, id);
            // THEN
            chai_1.expect(result).to.eq(undefined);
        }));
    });
});
//# sourceMappingURL=EventsCtrl.spec.js.map