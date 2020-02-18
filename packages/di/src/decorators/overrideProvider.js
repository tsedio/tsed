"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GlobalProviders_1 = require("../registries/GlobalProviders");
/**
 * Override a provider which is already registered in ProviderRegistry.
 * @returns {Function}
 * @decorators
 * @param originalProvider
 */
function OverrideProvider(originalProvider) {
    return (target) => {
        GlobalProviders_1.GlobalProviders.get(originalProvider).useClass = target;
    };
}
exports.OverrideProvider = OverrideProvider;
//# sourceMappingURL=overrideProvider.js.map