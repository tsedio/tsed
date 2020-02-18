"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storeFn_1 = require("./storeFn");
function StoreMerge(key, value) {
    return storeFn_1.StoreFn((store) => {
        store.merge(key, value);
    });
}
exports.StoreMerge = StoreMerge;
//# sourceMappingURL=storeMerge.js.map