"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const components_1 = require("./components");
const ConverterService_1 = require("./services/ConverterService");
let ConverterModule = class ConverterModule {
};
ConverterModule = tslib_1.__decorate([
    di_1.Module({
        imports: [components_1.ArrayConverter, components_1.DateConverter, components_1.MapConverter, components_1.PrimitiveConverter, components_1.SetConverter, components_1.SymbolConverter, ConverterService_1.ConverterService]
    })
], ConverterModule);
exports.ConverterModule = ConverterModule;
//# sourceMappingURL=ConverterModule.js.map