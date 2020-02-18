"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class LocalsContainer extends Map {
    /**
     * Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).
     * @param eventName The event name to emit at all services.
     * @param args List of the parameters to give to each services.
     * @returns {Promise<any[]>} A list of promises.
     */
    emit(eventName, ...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const instances = this.toArray();
            for (const instance of instances) {
                if (typeof instance === "object" && instance && eventName in instance) {
                    yield instance[eventName](...args);
                }
            }
        });
    }
    toArray() {
        return Array.from(this.values());
    }
    destroy() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.emit("$onDestroy");
            this.clear();
        });
    }
}
exports.LocalsContainer = LocalsContainer;
//# sourceMappingURL=LocalsContainer.js.map