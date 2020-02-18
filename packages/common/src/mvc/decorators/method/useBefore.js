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
 * @UseBefore(Middleware1) // called only one time before all endpoint
 * export class Ctrl {
 *
 *    @Get('/')
 *    @UseBefore(Middleware2)
 *    get() { }
 * }
 * ```
 *
 * @returns {function(any, any, any): *}
 * @param args
 * @decorator
 * @endpoint
 */
function UseBefore(...args) {
    return (...decoratorArgs) => {
        switch (core_1.getDecoratorType(decoratorArgs, true)) {
            case "method":
                EndpointRegistry_1.EndpointRegistry.useBefore(decoratorArgs[0], decoratorArgs[1], args);
                return decoratorArgs[2];
            case "class":
                core_1.StoreMerge("middlewares", { useBefore: args })(...decoratorArgs);
                break;
            default:
                throw new core_1.UnsupportedDecoratorType(UseBefore, decoratorArgs);
        }
    };
}
exports.UseBefore = UseBefore;
//# sourceMappingURL=useBefore.js.map