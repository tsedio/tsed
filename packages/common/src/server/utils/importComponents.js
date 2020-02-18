"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const importFiles_1 = require("./importFiles");
function resolveSymbols(item, excludes) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (core_1.isClass(item)) {
            return yield [item];
        }
        return importFiles_1.importFiles(item, excludes);
    });
}
function mapConfiguration(config) {
    if (core_1.isArray(config)) {
        return config.map((value) => {
            return {
                values: [].concat(value)
            };
        });
    }
    return Object.keys(config).reduce((list, key) => {
        list.push({
            endpoint: key,
            values: [].concat(config[key])
        });
        return list;
    }, []);
}
exports.mapConfiguration = mapConfiguration;
function importComponents(config, excludes) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        config = mapConfiguration(config);
        const list = [];
        for (const option of config) {
            for (const value of option.values) {
                const symbols = yield resolveSymbols(value, excludes);
                symbols
                    .filter(symbol => core_1.isClass(symbol))
                    .forEach(symbol => {
                    const provider = { token: symbol, route: option.endpoint };
                    list.push(provider);
                });
            }
        }
        return list;
    });
}
exports.importComponents = importComponents;
//# sourceMappingURL=importComponents.js.map