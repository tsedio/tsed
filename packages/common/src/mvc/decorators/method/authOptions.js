"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
/**
 * Change authentication options.
 *
 * ```typescript
 * @Controller('/mypath')
 * @UseAuth(MyAuthStrategy, {role: ''})
 * class MyCtrl {
 *
 *   @Get('/')
 *   @AuthOptions(MyAuthStrategy, {role: 'admin'})
 *   public getResource(){}
 * }
 * ```
 *
 * @param guardAuth
 * @param options {Object} Object passed to the customer auth strategy
 * @returns {Function}
 * @decorator
 * @endpoint
 */
function AuthOptions(guardAuth, options = {}) {
    return (...args) => {
        switch (core_1.getDecoratorType(args, true)) {
            case "method":
                return core_1.StoreFn((store) => {
                    if (options.responses) {
                        const { responses } = options;
                        store.merge("responses", responses, true);
                        delete options.responses;
                    }
                    if (options.security) {
                        const { security } = options;
                        store.merge("operation", { security }, true);
                        delete options.security;
                    }
                    store.merge(guardAuth, options, true);
                })(...args);
            case "class":
                core_1.decorateMethodsOf(args[0], AuthOptions(guardAuth, options));
                break;
            default:
                throw new core_1.UnsupportedDecoratorType(AuthOptions, args);
        }
    };
}
exports.AuthOptions = AuthOptions;
//# sourceMappingURL=authOptions.js.map