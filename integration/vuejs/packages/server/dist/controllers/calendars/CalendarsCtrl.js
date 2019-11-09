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
const swagger_1 = require("@tsed/swagger");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const Calendar_1 = require("../../models/Calendar");
const CalendarsService_1 = require("../../services/calendars/CalendarsService");
const EventsCtrl_1 = require("../events/EventsCtrl");
/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventsCtrl is a dependency of CalendarsCtrl.
 * All routes of EventsCtrl will be mounted on the `/calendars` path.
 */
let CalendarsCtrl = class CalendarsCtrl {
    constructor(calendarsService) {
        this.calendarsService = calendarsService;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const calendar = yield this.calendarsService.find(id);
            if (calendar) {
                return calendar;
            }
            throw new ts_httpexceptions_1.NotFound("Calendar not found");
        });
    }
    save(calendar) {
        return this.calendarsService.create(calendar);
    }
    update(id, calendar) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.calendarsService.update(Object.assign({ id }, calendar));
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.calendarsService.remove(id);
        });
    }
    getAllCalendars() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.calendarsService.query();
        });
    }
};
__decorate([
    common_1.Get("/:id"),
    swagger_1.Returns(Calendar_1.Calendar),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarsCtrl.prototype, "get", null);
__decorate([
    common_1.Put("/"),
    common_1.Status(201),
    swagger_1.Returns(Calendar_1.Calendar),
    __param(0, common_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Calendar_1.CreateCalendar]),
    __metadata("design:returntype", Promise)
], CalendarsCtrl.prototype, "save", null);
__decorate([
    common_1.Post("/:id"),
    swagger_1.Returns(Calendar_1.Calendar),
    __param(0, common_1.PathParams("id")), __param(0, common_1.Required()),
    __param(1, common_1.BodyParams()), __param(1, common_1.Required()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Calendar_1.CreateCalendar]),
    __metadata("design:returntype", Promise)
], CalendarsCtrl.prototype, "update", null);
__decorate([
    common_1.Delete("/"),
    common_1.Status(204),
    __param(0, common_1.BodyParams("id")), __param(0, common_1.Required()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarsCtrl.prototype, "remove", null);
__decorate([
    common_1.Get("/"),
    swagger_1.ReturnsArray(Calendar_1.Calendar),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CalendarsCtrl.prototype, "getAllCalendars", null);
CalendarsCtrl = __decorate([
    common_1.Controller({
        path: "/calendars",
        children: [
            EventsCtrl_1.EventsCtrl
        ]
    }),
    __metadata("design:paramtypes", [CalendarsService_1.CalendarsService])
], CalendarsCtrl);
exports.CalendarsCtrl = CalendarsCtrl;
//# sourceMappingURL=CalendarsCtrl.js.map