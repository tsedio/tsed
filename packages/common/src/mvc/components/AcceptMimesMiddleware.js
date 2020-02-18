"use strict";
var AcceptMimesMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const decorators_1 = require("../decorators");
/**
 * @middleware
 */
let AcceptMimesMiddleware = AcceptMimesMiddleware_1 = class AcceptMimesMiddleware {
    use(endpoint, request) {
        const mimes = endpoint.get(AcceptMimesMiddleware_1) || [];
        const find = mimes.find((mime) => request.accepts(mime));
        if (!find) {
            throw new ts_httpexceptions_1.NotAcceptable(mimes.join(", "));
        }
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, decorators_1.EndpointInfo()), tslib_1.__param(1, decorators_1.Req()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AcceptMimesMiddleware.prototype, "use", null);
AcceptMimesMiddleware = AcceptMimesMiddleware_1 = tslib_1.__decorate([
    decorators_1.Middleware()
], AcceptMimesMiddleware);
exports.AcceptMimesMiddleware = AcceptMimesMiddleware;
//# sourceMappingURL=AcceptMimesMiddleware.js.map