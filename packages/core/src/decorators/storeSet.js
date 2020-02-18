"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storeFn_1 = require("./storeFn");
function StoreSet(key, value) {
    return storeFn_1.StoreFn((store) => {
        store.set(key, value);
    });
}
exports.StoreSet = StoreSet;
//# sourceMappingURL=storeSet.js.map