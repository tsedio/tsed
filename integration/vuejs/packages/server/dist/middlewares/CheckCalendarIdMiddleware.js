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
const CalendarsService_1 = require("../services/calendars/CalendarsService");
let CheckCalendarIdMiddleware = class CheckCalendarIdMiddleware {
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    use(calendarId) {
        return __awaiter(this, void 0, void 0, function* () {
            const calendar = yield this.calendarService.find(calendarId);
            if (!calendar) {
                throw new ts_httpexceptions_1.NotFound("Calendar not found");
            }
        });
    }
};
__decorate([
    __param(0, common_1.Required()), __param(0, common_1.PathParams("calendarId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CheckCalendarIdMiddleware.prototype, "use", null);
CheckCalendarIdMiddleware = __decorate([
    common_1.Middleware(),
    __metadata("design:paramtypes", [CalendarsService_1.CalendarsService])
], CheckCalendarIdMiddleware);
exports.CheckCalendarIdMiddleware = CheckCalendarIdMiddleware;
//# sourceMappingURL=CheckCalendarIdMiddleware.js.map