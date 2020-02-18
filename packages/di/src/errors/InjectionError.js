"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const ts_log_debug_1 = require("ts-log-debug");
class InjectionError extends Error {
    constructor(token, origin) {
        super(core_1.isString(origin) ? origin : "");
        this.name = "INJECTION_ERROR";
        this.tokens = [];
        this.tokens = [token];
        if (origin) {
            if (core_1.isString(origin)) {
                this.origin = {
                    message: origin,
                    stack: this.stack
                };
            }
            else {
                if (origin.tokens) {
                    this.tokens = this.tokens.concat(origin.tokens);
                    this.origin = origin.origin;
                }
                else {
                    this.origin = origin;
                }
            }
        }
        const originMessage = this.origin ? "\nOrigin: " + this.origin.message : "";
        const tokensMessage = this.tokens.map(token => core_1.nameOf(token)).join(" > ");
        this.message = `Injection failed on ${tokensMessage}${originMessage}`;
    }
    static throwInjectorError(token, currentDependency, error) {
        if (currentDependency && core_1.isClass(token)) {
            error.message = printDependencyInjectionError(token, Object.assign(Object.assign({}, currentDependency), { message: error.message }));
        }
        throw new InjectionError(token, error);
    }
}
exports.InjectionError = InjectionError;
function printDependencyInjectionError(token, options) {
    let erroredArg = "";
    const args = core_1.getConstructorArgNames(token)
        .map((arg, index) => {
        if (options.index === index) {
            erroredArg = arg;
            arg = ts_log_debug_1.colorize(arg, "red");
        }
        return `${arg}: ${core_1.nameOf(options.deps[index])}`;
    })
        .join(", ");
    const signature = core_1.nameOf(token) + "->constructor(" + args + ")";
    const indexOf = signature.indexOf(erroredArg) - 5;
    const drawline = (indexOf) => " ".repeat(indexOf) + ts_log_debug_1.colorize("^" + "‾".repeat(erroredArg.length - 1), "red");
    return "Unable to inject dependency. " + options.message + "\n\n" + signature + "\n" + (indexOf > -1 ? drawline(indexOf) : "");
}
//# sourceMappingURL=InjectionError.js.map