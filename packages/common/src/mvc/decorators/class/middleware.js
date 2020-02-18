"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MiddlewareRegistry_1 = require("../../registries/MiddlewareRegistry");
/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 */
function Middleware() {
    return MiddlewareRegistry_1.registerMiddleware;
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map