"use strict";
var AuthenticatedMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const middleware_1 = require("../decorators/class/middleware");
const endpointInfo_1 = require("../decorators/params/endpointInfo");
const request_1 = require("../decorators/params/request");
/**
 * This middleware manage the authentication based on passport strategy.
 *
 * ::: warning
 * This usage is deprecated in favor of @@UseAuth@@. See [Authentication page](https://tsed.io/docs/authentication.html#usage).
 * :::
 *
 * @middleware
 * @deprecated See [Authentication page](https://tsed.io/docs/authentication.html#usage).
 */
let AuthenticatedMiddleware = AuthenticatedMiddleware_1 = class AuthenticatedMiddleware {
    use(request, endpoint) {
        const options = endpoint.get(AuthenticatedMiddleware_1) || {};
        // @ts-ignore
        if (request.isAuthenticated && !request.isAuthenticated(options)) {
            throw new ts_httpexceptions_1.Unauthorized("Unauthorized");
        }
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, request_1.Req()), tslib_1.__param(1, endpointInfo_1.EndpointInfo()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthenticatedMiddleware.prototype, "use", null);
AuthenticatedMiddleware = AuthenticatedMiddleware_1 = tslib_1.__decorate([
    middleware_1.Middleware()
], AuthenticatedMiddleware);
exports.AuthenticatedMiddleware = AuthenticatedMiddleware;
//# sourceMappingURL=AuthenticatedMiddleware.js.map