"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const ConverterModule_1 = require("../converters/ConverterModule");
const jsonschema_1 = require("../jsonschema");
const ControllerBuilder_1 = require("./builders/ControllerBuilder");
const ParseService_1 = require("./services/ParseService");
const RouteService_1 = require("./services/RouteService");
const ValidationService_1 = require("./services/ValidationService");
let MvcModule = class MvcModule {
    constructor(injector) {
        const routers = injector
            .getProviders(di_1.ProviderType.CONTROLLER)
            .map(provider => {
            if (!provider.hasParent()) {
                return new ControllerBuilder_1.ControllerBuilder(provider).build(injector);
            }
        })
            .filter(Boolean);
        return { routers };
    }
};
MvcModule = tslib_1.__decorate([
    di_1.Module({
        imports: [di_1.InjectorService, ConverterModule_1.ConverterModule, ParseService_1.ParseService, ValidationService_1.ValidationService, jsonschema_1.JsonSchemesService, RouteService_1.RouteService]
    }),
    tslib_1.__metadata("design:paramtypes", [di_1.InjectorService])
], MvcModule);
exports.MvcModule = MvcModule;
//# sourceMappingURL=MvcModule.js.map