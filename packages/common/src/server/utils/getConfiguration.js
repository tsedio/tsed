"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const di_1 = require("@tsed/di");
function getConfiguration(module, configuration = {}) {
    const provider = di_1.GlobalProviders.get(core_1.constructorOf(module));
    return Object.assign(Object.assign({}, provider.configuration), configuration);
}
exports.getConfiguration = getConfiguration;
//# sourceMappingURL=getConfiguration.js.map