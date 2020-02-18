"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
const ts_log_debug_1 = require("ts-log-debug");
const ServerSettingsService_1 = require("../../config/services/ServerSettingsService");
ts_log_debug_1.$log.name = "TSED";
ts_log_debug_1.$log.level = "info";
function createInjector(settings = {}) {
    const injector = new di_1.InjectorService();
    injector.settings = createSettingsService(injector);
    injector.logger = ts_log_debug_1.$log;
    // @ts-ignore
    injector.settings.set(settings);
    /* istanbul ignore next */
    if (injector.settings.env === "test") {
        injector.logger.stop();
    }
    return injector;
}
exports.createInjector = createInjector;
function createSettingsService(injector) {
    const provider = di_1.GlobalProviders.get(ServerSettingsService_1.ServerSettingsService).clone();
    provider.instance = injector.invoke(provider.useClass);
    injector.addProvider(ServerSettingsService_1.ServerSettingsService, provider);
    return provider.instance;
}
//# sourceMappingURL=createInjector.js.map