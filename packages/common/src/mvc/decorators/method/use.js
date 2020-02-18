"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const EndpointRegistry_1 = require("../../registries/EndpointRegistry");
/**
 * Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
 * the base of the requested path matches `path.
 *
 * ```typescript
 * @Controller('/')
 * @Use(Middleware1)
 * export class Ctrl {
 *
 *    @Get('/')
 *    @Use(Middleware2)
 *    get() { }
 * }
 *
 * ```
 *
 * @returns {Function}
 * @param args
 * @decorator
 * @endpoint
 */
function Use(...args) {
    return (target, targetKey, descriptor) => {
        if (core_1.getDecoratorType([target, targetKey, descriptor]) === "method") {
            EndpointRegistry_1.EndpointRegistry.use(target, targetKey, args);
            return descriptor;
        }
        core_1.Store.from(target).merge("middlewares", {
            use: args
        });
    };
}
exports.Use = Use;
//# sourceMappingURL=use.js.map