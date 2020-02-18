"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const ts_httpexceptions_1 = require("ts-httpexceptions");
/**
 * @private
 */
class TemplateRenderingError extends ts_httpexceptions_1.InternalServerError {
    constructor(target, method, err) {
        super(TemplateRenderingError.buildMessage(target, method, err));
    }
    /**
     *
     * @returns {string}
     */
    static buildMessage(target, method, err) {
        return `Template rendering error : ${core_1.nameOf(target)}.${String(method)}()\n` + err;
    }
}
exports.TemplateRenderingError = TemplateRenderingError;
//# sourceMappingURL=TemplateRenderingError.js.map