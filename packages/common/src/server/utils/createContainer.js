"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const di_1 = require("@tsed/di");
function createContainer(rootModule) {
    const container = new di_1.Container(di_1.GlobalProviders.entries());
    if (rootModule) {
        container.delete(core_1.constructorOf(rootModule));
    }
    return container;
}
exports.createContainer = createContainer;
//# sourceMappingURL=createContainer.js.map