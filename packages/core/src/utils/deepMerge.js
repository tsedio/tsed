"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepClone_1 = require("./deepClone");
const deepExtends_1 = require("./deepExtends");
function deepMerge(origin, source, inverse = false) {
    origin = deepClone_1.deepClone(origin);
    source = deepClone_1.deepClone(source);
    return inverse ? deepExtends_1.deepExtends(origin, source) : deepExtends_1.deepExtends(source, origin);
}
exports.deepMerge = deepMerge;
//# sourceMappingURL=deepMerge.js.map