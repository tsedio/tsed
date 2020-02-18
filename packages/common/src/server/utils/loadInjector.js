"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mvc_1 = require("../../mvc");
const createContainer_1 = require("./createContainer");
function loadInjector(injector, container = createContainer_1.createContainer()) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Clone all providers in the container
        injector.addProviders(container);
        // Resolve all configuration
        injector.resolveConfiguration();
        injector.settings.forEach((value, key) => {
            injector.logger.debug(`settings.${key} =>`, value);
        });
        injector.invoke(mvc_1.MvcModule);
        return injector.load(container);
    });
}
exports.loadInjector = loadInjector;
//# sourceMappingURL=loadInjector.js.map