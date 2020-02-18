"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setLoggerLevel(injector) {
    const level = injector.settings.logger.level;
    /* istanbul ignore next */
    if (level && injector.settings.env !== "test") {
        injector.logger.level = level;
    }
}
exports.setLoggerLevel = setLoggerLevel;
//# sourceMappingURL=setLoggerLevel.js.map