"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_log_debug_1 = require("ts-log-debug");
class RequestLogger {
    constructor(logger, { id, startDate, url, ignoreUrlPatterns = [], minimalRequestPicker, completeRequestPicker, level = "all", maxStackSize = 30 }) {
        this.logger = logger;
        this.stack = [];
        this.id = id;
        this.url = url;
        this.startDate = startDate;
        this.ignoreUrlPatterns = ignoreUrlPatterns.map((pattern) => typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern);
        this.minimalRequestPicker = minimalRequestPicker || ((l) => l);
        this.completeRequestPicker = completeRequestPicker || ((l) => l);
        // @ts-ignore
        this.level = ts_log_debug_1.levels()[level.toUpperCase()] || ts_log_debug_1.levels().ALL;
        this.maxStackSize = maxStackSize;
    }
    info(obj) {
        this.run(ts_log_debug_1.levels().INFO, () => {
            const data = this.minimalRequestPicker(this.getData(obj));
            this.stack.push({ level: "info", data });
        });
    }
    debug(obj, withRequest = true) {
        this.run(ts_log_debug_1.levels().DEBUG, () => {
            obj = this.getData(obj);
            const data = withRequest ? this.completeRequestPicker(obj) : obj;
            this.stack.push({ level: "debug", data });
        });
    }
    warn(obj) {
        this.run(ts_log_debug_1.levels().WARN, () => {
            const data = this.completeRequestPicker(this.getData(obj));
            this.stack.push({ level: "warn", data });
        });
    }
    error(obj) {
        this.run(ts_log_debug_1.levels().ERROR, () => {
            const data = this.completeRequestPicker(this.getData(obj));
            this.stack.push({ level: "error", data });
        });
    }
    trace(obj) {
        this.run(ts_log_debug_1.levels().TRACE, () => {
            const data = this.completeRequestPicker(this.getData(obj));
            this.stack.push({ level: "trace", data });
        });
    }
    flush() {
        if (this.stack.length) {
            this.stack.forEach(({ level, data }) => {
                this.logger[level](data);
            });
            this.stack = [];
        }
    }
    isLevelEnabled(otherLevel) {
        return this.level.isLessThanOrEqualTo(otherLevel);
    }
    destroy() {
        this.flush();
        delete this.logger;
        delete this.stack;
        delete this.minimalRequestPicker;
        delete this.completeRequestPicker;
    }
    /**
     * Return the duration between the time when LogIncomingRequest has handle the request and now.
     * @returns {number}
     */
    getDuration() {
        return new Date().getTime() - this.startDate.getTime();
    }
    getData(obj) {
        if (typeof obj === "string") {
            obj = { message: obj };
        }
        return Object.assign({ reqId: this.id, time: new Date(), duration: this.getDuration() }, obj);
    }
    run(level, cb) {
        if (!this.isLevelEnabled(level)) {
            return;
        }
        const match = this.ignoreUrlPatterns.find(reg => !!this.url.match(reg));
        !match && cb();
        if (this.maxStackSize < this.stack.length) {
            this.flush();
        }
    }
}
exports.RequestLogger = RequestLogger;
//# sourceMappingURL=RequestLogger.js.map