"use strict";
var ParseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const di_1 = require("@tsed/di");
/**
 *
 */
let ParseService = ParseService_1 = class ParseService {
    constructor() {
    }
    /**
     * Eval an expression with a scope context and return value.
     * @param expression
     * @param scope
     * @param clone
     * @returns {any}
     */
    eval(expression, scope, clone = true) {
        if (core_1.isEmpty(expression)) {
            return typeof scope === "object" && clone ? ParseService_1.clone(scope) : scope;
        }
        const value = core_1.getValue(expression, scope);
        return typeof value === "object" && clone ? ParseService_1.clone(value) : value;
    }
};
/**
 * Clone an object.
 * @param src
 */
ParseService.clone = (src) => JSON.parse(JSON.stringify(src));
ParseService = ParseService_1 = tslib_1.__decorate([
    di_1.Service(),
    tslib_1.__metadata("design:paramtypes", [])
], ParseService);
exports.ParseService = ParseService;
//# sourceMappingURL=ParseService.js.map