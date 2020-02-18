"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
const ControllerProvider_1 = require("../models/ControllerProvider");
const ExpressRouter_1 = require("../services/ExpressRouter");
// tslint:disable-next-line: variable-name
exports.ControllerRegistry = di_1.GlobalProviders.createRegistry(di_1.ProviderType.CONTROLLER, ControllerProvider_1.ControllerProvider, {
    injectable: false,
    onInvoke(provider, locals) {
        locals.set(ExpressRouter_1.ExpressRouter, provider.router);
    }
});
//# sourceMappingURL=ControllerRegistry.js.map