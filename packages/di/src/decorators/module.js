"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const interfaces_1 = require("../interfaces");
const configuration_1 = require("./configuration");
const injectable_1 = require("./injectable");
/**
 * Declare a new Ts.ED module
 *
 * ## Options
 * - imports: List of Provider which must be built by injector before invoking the module
 * - resolvers: List of external DI must be used to resolve unknown provider
 * - deps: List of provider must be injected to the module constructor (explicit declaration)
 *
 * @param options
 * @decorator
 */
function Module(options = {}) {
    const { imports, resolvers, deps, root, scope } = options, configuration = tslib_1.__rest(options, ["imports", "resolvers", "deps", "root", "scope"]);
    return core_1.applyDecorators(configuration_1.Configuration(configuration), injectable_1.Injectable({
        type: interfaces_1.ProviderType.PROVIDER,
        scope: interfaces_1.ProviderScope.SINGLETON,
        imports,
        deps,
        injectable: false,
        resolvers,
        root
    }));
}
exports.Module = Module;
//# sourceMappingURL=module.js.map