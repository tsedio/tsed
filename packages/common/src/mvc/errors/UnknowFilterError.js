"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const ts_httpexceptions_1 = require("ts-httpexceptions");
/**
 * @private
 */
class UnknowFilterError extends ts_httpexceptions_1.InternalServerError {
    constructor(target) {
        super(UnknowFilterError.buildMessage(target));
    }
    /**
     *
     * @returns {string}
     */
    static buildMessage(target) {
        return `Filter ${core_1.nameOf(target)} not found.`;
    }
}
exports.UnknowFilterError = UnknowFilterError;
//# sourceMappingURL=UnknowFilterError.js.map