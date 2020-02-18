"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const ProviderScope_1 = require("../interfaces/ProviderScope");
/**
 *
 * @param {"request" | "singleton" | ProviderScope} scope
 * @returns {Function}
 * @constructor
 */
function Scope(scope = ProviderScope_1.ProviderScope.REQUEST) {
    return core_1.StoreSet("scope", scope);
}
exports.Scope = Scope;
//# sourceMappingURL=scope.js.map