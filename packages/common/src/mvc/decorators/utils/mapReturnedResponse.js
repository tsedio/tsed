"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
function mapReturnedResponse(_a) {
    var { use, collection } = _a, options = tslib_1.__rest(_a, ["use", "collection"]);
    return Object.assign(Object.assign({}, options), { type: options.type || use, collectionType: options.collectionType || collection });
}
exports.mapReturnedResponse = mapReturnedResponse;
//# sourceMappingURL=mapReturnedResponse.js.map