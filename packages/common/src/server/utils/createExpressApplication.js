"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
const Express = require("express");
const mvc_1 = require("../../mvc");
const expressApplication_1 = require("../decorators/expressApplication");
function createExpressApplication(injector) {
    injector.forkProvider(expressApplication_1.ExpressApplication);
}
exports.createExpressApplication = createExpressApplication;
di_1.registerProvider({
    provide: expressApplication_1.ExpressApplication,
    deps: [di_1.InjectorService],
    scope: di_1.ProviderScope.SINGLETON,
    global: true,
    useFactory(injector) {
        const expressApp = Express();
        const originalUse = expressApp.use;
        expressApp.use = function (...args) {
            args = args.map(arg => {
                if (injector.has(arg)) {
                    arg = mvc_1.HandlerBuilder.from(arg).build(injector);
                }
                return arg;
            });
            return originalUse.call(this, ...args);
        };
        return expressApp;
    }
});
//# sourceMappingURL=createExpressApplication.js.map