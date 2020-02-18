"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MiddlewareRegistry_1 = require("../../registries/MiddlewareRegistry");
/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 * @deprecated Use Middleware decorator instead of
 */
function MiddlewareError() {
    return MiddlewareRegistry_1.registerMiddleware;
}
exports.MiddlewareError = MiddlewareError;
//# sourceMappingURL=middlewareError.js.map