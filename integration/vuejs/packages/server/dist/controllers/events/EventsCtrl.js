"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const common_1 = require("@tsed/common");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const CheckCalendarIdMiddleware_1 = require("../../middlewares/CheckCalendarIdMiddleware");
let EventsCtrl = class EventsCtrl {
    constructor() {
        this.AUTO_INC = 5;
        this.events = require("../../../resources/events.json");
    }
    get(calendarId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = this.events.find(event => event.id === id && event.calendarId === calendarId);
            if (event) {
                return event;
            }
            throw new ts_httpexceptions_1.NotFound("event not found");
        });
    }
    getTasks(calendarId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = this.events.find(event => event.id === id && event.calendarId === calendarId);
            if (event) {
                return event.tasks || [];
            }
            throw new ts_httpexceptions_1.NotFound("event not found");
        });
    }
    save(calendarId, startDate, endDate, name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.AUTO_INC++;
            const event = { id: String(this.AUTO_INC), calendarId, startDate, endDate, name };
            this.events.push(event);
            return event;
        });
    }
    update(calendarId, id, startDate, endDate, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.get(calendarId, id);
            event.name = name;
            event.startDate = name;
            event.endDate = name;
            return event;
        });
    }
    remove(calendarId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.events = this.events.filter(event => event.id === id && event.calendarId === calendarId);
        });
    }
    getEvents(calendarId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.events.filter(event => event.calendarId === calendarId);
        });
    }
};
__decorate([
    common_1.Get("/:id"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("calendarId")),
    __param(1, common_1.PathParams("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "get", null);
__decorate([
    common_1.Get("/:id/tasks"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("calendarId")),
    __param(1, common_1.PathParams("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "getTasks", null);
__decorate([
    common_1.Put("/"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("calendarId")),
    __param(1, common_1.BodyParams("startDate")),
    __param(2, common_1.BodyParams("endDate")),
    __param(3, common_1.BodyParams("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "save", null);
__decorate([
    common_1.Post("/:id"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("calendarId")),
    __param(1, common_1.PathParams("id")),
    __param(2, common_1.BodyParams("startDate")),
    __param(3, common_1.BodyParams("endDate")),
    __param(4, common_1.BodyParams("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "update", null);
__decorate([
    common_1.Delete("/:id"),
    common_1.Authenticated(),
    common_1.Status(204),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("calendarId")),
    __param(1, common_1.PathParams("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "remove", null);
__decorate([
    common_1.Get("/"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("calendarId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "getEvents", null);
EventsCtrl = __decorate([
    common_1.Controller("/:calendarId/events"),
    common_1.MergeParams(true),
    common_1.UseBefore(CheckCalendarIdMiddleware_1.CheckCalendarIdMiddleware)
], EventsCtrl);
exports.EventsCtrl = EventsCtrl;
//# sourceMappingURL=EventsCtrl.js.map