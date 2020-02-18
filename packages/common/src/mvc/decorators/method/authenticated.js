"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticatedMiddleware_1 = require("../../components/AuthenticatedMiddleware");
const useAuth_1 = require("./useAuth");
/**
 * Use passport authentication strategy on your endpoint.
 *
 * ```typescript
 * @Controller('/mypath')
 * class MyCtrl {
 *
 *   @Get('/')
 *   @Authenticated({role: 'admin'})
 *   public getResource(){}
 * }
 * ```
 *
 * ::: warning
 * This usage is deprecated in favor of @@UseAuth@@. See [Authentication page](https://tsed.io/docs/authentication.html#usage).
 * :::
 *
 * @param options
 * @returns {Function}
 * @decorator
 * @endpoint
 * @deprecated See [Authentication page](https://tsed.io/docs/authentication.html#usage).
 */
function Authenticated(options = {}) {
    options = Object.assign({ responses: Object.assign({ "401": {
                description: "Unauthorized"
            } }, (options.responses || {})) }, options);
    return useAuth_1.UseAuth(AuthenticatedMiddleware_1.AuthenticatedMiddleware, options);
}
exports.Authenticated = Authenticated;
//# sourceMappingURL=authenticated.js.map