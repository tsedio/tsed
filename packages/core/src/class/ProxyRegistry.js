"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProxyMap_1 = require("./ProxyMap");
/**
 * @private
 */
class ProxyRegistry extends ProxyMap_1.ProxyMap {
    constructor(registry) {
        super(registry);
        this.registry = registry;
    }
    set(key, value) {
        this.registry.merge(key, value);
        return this;
    }
}
exports.ProxyRegistry = ProxyRegistry;
//# sourceMappingURL=ProxyRegistry.js.map