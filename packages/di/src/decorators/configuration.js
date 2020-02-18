"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const inject_1 = require("../decorators/inject");
function Configuration(configuration = {}) {
    return (...args) => {
        switch (core_1.getDecoratorType(args, true)) {
            case "class":
                core_1.StoreSet("configuration", configuration)(args[0]);
                break;
            case "parameter.constructor":
                return inject_1.Inject(Configuration)(...args);
        }
    };
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map