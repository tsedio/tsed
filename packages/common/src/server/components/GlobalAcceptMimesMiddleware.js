"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const mvc_1 = require("../../mvc");
/**
 * @middleware
 */
let GlobalAcceptMimesMiddleware = class GlobalAcceptMimesMiddleware {
    constructor(configuration) {
        this.configuration = configuration;
    }
    use(request) {
        const find = this.configuration.acceptMimes.find((mime) => !!request.accepts(mime));
        if (!find) {
            throw new ts_httpexceptions_1.NotAcceptable(this.configuration.acceptMimes.join(", "));
        }
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, mvc_1.Req()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], GlobalAcceptMimesMiddleware.prototype, "use", null);
GlobalAcceptMimesMiddleware = tslib_1.__decorate([
    mvc_1.Middleware(),
    tslib_1.__param(0, di_1.Configuration()),
    tslib_1.__metadata("design:paramtypes", [Object])
], GlobalAcceptMimesMiddleware);
exports.GlobalAcceptMimesMiddleware = GlobalAcceptMimesMiddleware;
//# sourceMappingURL=GlobalAcceptMimesMiddleware.js.map