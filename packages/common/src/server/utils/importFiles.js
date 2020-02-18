"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globby = require("globby");
const ts_log_debug_1 = require("ts-log-debug");
const cleanGlobPatterns_1 = require("./cleanGlobPatterns");
function importFiles(patterns, exclude) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const files = globby.sync(cleanGlobPatterns_1.cleanGlobPatterns(patterns, exclude));
        const symbols = [];
        for (const file of files) {
            try {
                const exports = yield Promise.resolve().then(() => require(file));
                Object.keys(exports).forEach(key => symbols.push(exports[key]));
            }
            catch (er) {
                /* istanbul ignore next */
                ts_log_debug_1.$log.error(er);
                /* istanbul ignore next */
                process.exit(-1);
            }
        }
        return symbols;
    });
}
exports.importFiles = importFiles;
//# sourceMappingURL=importFiles.js.map