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
 * @UseAfter(Middleware1)
 * export class Ctrl {
 *
 *    @Get('/')
 *    @UseAfter(Middleware2)
 *    get() { }
 * }
 * ```
 *
 * @returns {function(any, any, any): *}
 * @param args
 * @decorator
 * @endpoint
 */
function UseAfter(...args) {
    return (...decoratorArgs) => {
        switch (core_1.getDecoratorType(decoratorArgs, true)) {
            case "method":
                EndpointRegistry_1.EndpointRegistry.useAfter(decoratorArgs[0], decoratorArgs[1], args);
                return decoratorArgs[2];
            case "class":
                core_1.StoreMerge("middlewares", { useAfter: args })(...decoratorArgs);
                break;
            default:
                throw new core_1.UnsupportedDecoratorType(UseAfter, decoratorArgs);
        }
    };
}
exports.UseAfter = UseAfter;
//# sourceMappingURL=useAfter.js.map