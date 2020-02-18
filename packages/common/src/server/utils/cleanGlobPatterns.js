"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const normalizePath = require("normalize-path");
function mapExcludes(excludes) {
    return excludes.map((s) => `!${s.replace(/!/gi, "")}`);
}
function mapExtensions(file) {
    if (!require.extensions[".ts"] && !process.env["TS_TEST"]) {
        file = file.replace(/\.ts$/i, ".js");
    }
    return file;
}
function cleanGlobPatterns(files, excludes) {
    return []
        .concat(files)
        .map((s) => path_1.resolve(s))
        .concat(mapExcludes(excludes))
        .map(mapExtensions)
        .map((s) => normalizePath(s));
}
exports.cleanGlobPatterns = cleanGlobPatterns;
//# sourceMappingURL=cleanGlobPatterns.js.map