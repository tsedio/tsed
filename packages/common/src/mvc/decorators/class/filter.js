"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilterRegistry_1 = require("../../registries/FilterRegistry");
/**
 * Filter decorator declare a class as new Filter component.
 *
 * See [filters](/docs/filters.md) section for more information.
 * @returns {(target:any)=>undefined}
 * @decorator
 */
function Filter() {
    return FilterRegistry_1.registerFilter;
}
exports.Filter = Filter;
//# sourceMappingURL=filter.js.map