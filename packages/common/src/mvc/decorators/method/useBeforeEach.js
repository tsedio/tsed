"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const useBefore_1 = require("./useBefore");
/**
 * Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
 * the base of the requested path matches `path.
 *
 * ```typescript
 * @Controller('/')
 * @UseBeforeEach(Middleware1)  // Called before each endpoint
 * export class Ctrl {
 *
 *    @Get('/')
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
function UseBeforeEach(...args) {
    return (...decoratorArgs) => {
        switch (core_1.getDecoratorType(decoratorArgs, true)) {
            case "method":
                return useBefore_1.UseBefore(...args)(...decoratorArgs);
            case "class":
                core_1.decorateMethodsOf(decoratorArgs[0], useBefore_1.UseBefore(...args));
                break;
            default:
                throw new core_1.UnsupportedDecoratorType(UseBeforeEach, decoratorArgs);
        }
    };
}
exports.UseBeforeEach = UseBeforeEach;
//# sourceMappingURL=useBeforeEach.js.map