"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const PropertyRegistry_1 = require("../../../jsonschema/registries/PropertyRegistry");
const ParamRegistry_1 = require("../../registries/ParamRegistry");
function getStorableMetadata(decoratorArgs) {
    switch (core_1.getDecoratorType(decoratorArgs, true)) {
        case "parameter":
            return ParamRegistry_1.ParamRegistry.get(decoratorArgs[0], decoratorArgs[1], decoratorArgs[2]);
        case "property":
            return PropertyRegistry_1.PropertyRegistry.get(decoratorArgs[0], decoratorArgs[1]);
    }
}
exports.getStorableMetadata = getStorableMetadata;
//# sourceMappingURL=getStorableMetadata.js.map