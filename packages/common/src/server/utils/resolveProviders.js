"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const importComponents_1 = require("./importComponents");
function resolveProviders(injector) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const providers = yield Promise.all([
            importComponents_1.importComponents(injector.settings.mount, injector.settings.exclude),
            importComponents_1.importComponents(injector.settings.componentsScan, injector.settings.exclude)
        ]);
        return [].concat(...providers);
    });
}
exports.resolveProviders = resolveProviders;
//# sourceMappingURL=resolveProviders.js.map