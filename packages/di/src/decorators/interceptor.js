"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProviderRegistry_1 = require("../registries/ProviderRegistry");
/**
 * The decorators `@Service()` declare a new service can be injected in other service or controller on there `constructor`.
 * All services annotated with `@Service()` are constructed one time.
 *
 * > `@Service()` use the `reflect-metadata` to collect and inject service on controllers or other services.
 *
 * @returns {Function}
 * @decorator
 */
function Interceptor() {
    return ProviderRegistry_1.registerInterceptor;
}
exports.Interceptor = Interceptor;
//# sourceMappingURL=interceptor.js.map