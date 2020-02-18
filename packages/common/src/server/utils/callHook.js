"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util = require("util");
const SKIP_HOOKS = ["$beforeInit", "$afterInit", "$onInit", "$onMountingMiddlewares"];
function callHook(injector, rootModule, key, ...args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        injector.logger.info(`\x1B[1mCall hook ${key}\x1B[22m`);
        if (key in rootModule) {
            const hookDepreciation = (hook, newHook) => util.deprecate(() => { }, `${hook} hook is deprecated. ${newHook ? "Use " + newHook + " instead" : "Hook will be removed"}`)();
            if (key === "$onInit") {
                hookDepreciation("$onInit", "$beforeInit");
            }
            if (key === "$onMountingMiddlewares") {
                hookDepreciation("$onMountingMiddlewares", "$beforeRoutesInit");
            }
            // istanbul ignore next
            if (key === "$onServerInitError") {
                hookDepreciation("$onServerInitError");
            }
            yield rootModule[key](...args);
        }
        if (!SKIP_HOOKS.includes(key)) {
            yield injector.emit(key);
        }
    });
}
exports.callHook = callHook;
//# sourceMappingURL=callHook.js.map