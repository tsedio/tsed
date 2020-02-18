"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var core_1 = require("@tsed/core");
exports.Registry = core_1.Registry;
tslib_1.__exportStar(require("@tsed/di"), exports);
tslib_1.__exportStar(require("./config"), exports);
tslib_1.__exportStar(require("./jsonschema"), exports);
tslib_1.__exportStar(require("./converters"), exports);
tslib_1.__exportStar(require("./mvc"), exports);
tslib_1.__exportStar(require("./server"), exports);
var ts_log_debug_1 = require("ts-log-debug");
exports.$log = ts_log_debug_1.$log;
//# sourceMappingURL=index.js.map