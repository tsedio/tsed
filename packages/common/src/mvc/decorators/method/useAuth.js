"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const authOptions_1 = require("./authOptions");
const useBefore_1 = require("./useBefore");
/**
 * Use custom authentication strategy on your endpoint.
 *
 * ```typescript
 * @Controller('/mypath')
 * @UseAuth(MyAuthStrategy)
 * class MyCtrl {
 *
 *   @Get('/')
 *   @UseAuth(MyAuthStrategy, {role: 'admin'})
 *   public getResource(){}
 * }
 * ```
 *
 * @param guardAuth {Type<any>} A middleware which implement a custom auth strategy
 * @param options {Object} Object passed to the customer auth strategy
 * @returns {Function}
 * @decorator
 * @endpoint
 */
function UseAuth(guardAuth, options = {}) {
    return (...args) => {
        switch (core_1.getDecoratorType(args, true)) {
            case "method":
                return core_1.applyDecorators(core_1.StoreFn((store) => {
                    if (!store.has(guardAuth)) {
                        return useBefore_1.UseBefore(guardAuth);
                    }
                }), authOptions_1.AuthOptions(guardAuth, options))(...args);
            case "class":
                core_1.decorateMethodsOf(args[0], UseAuth(guardAuth, options));
                break;
            default:
                throw new core_1.UnsupportedDecoratorType(UseAuth, args);
        }
    };
}
exports.UseAuth = UseAuth;
//# sourceMappingURL=useAuth.js.map