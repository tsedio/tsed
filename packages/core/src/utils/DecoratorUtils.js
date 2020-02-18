"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectUtils_1 = require("./ObjectUtils");
/**
 *
 * @param {any[]} args
 * @param longType
 * @returns {"parameter" | "property" | "property.static" | "method" | "method.static" | "class"}
 */
function getDecoratorType(args, longType = false) {
    const [target, propertyKey, descriptor] = args;
    const staticType = (type) => {
        if (!longType) {
            return type;
        }
        return target !== ObjectUtils_1.getClass(target) ? type : (type + ".static");
    };
    if (typeof descriptor === "number") {
        return propertyKey ? staticType("parameter") : longType ? "parameter.constructor" : "parameter";
    }
    if ((propertyKey && descriptor === undefined) || (descriptor && (descriptor.get || descriptor.set))) {
        return staticType("property");
    }
    return descriptor && descriptor.value ? staticType("method") : "class";
}
exports.getDecoratorType = getDecoratorType;
/**
 *
 */
class UnsupportedDecoratorType extends Error {
    constructor(decorator, args) {
        super(UnsupportedDecoratorType.buildMessage(decorator, args));
    }
    static buildMessage(decorator, args) {
        const [target, propertyKey, index] = args;
        const bindingType = getDecoratorType(args, true);
        const shortBinding = bindingType.split("/")[0];
        const param = shortBinding === "parameter" ? ".[" + index + "]" : "";
        const cstr = shortBinding === "parameter" ? ".constructor" : "";
        const method = propertyKey ? "." + propertyKey : cstr;
        const path = ObjectUtils_1.nameOf(ObjectUtils_1.getClass(target)) + method + param;
        return `${decorator.name} cannot used as ${bindingType} decorator on ${path}`;
    }
}
exports.UnsupportedDecoratorType = UnsupportedDecoratorType;
/**
 *
 * @param target
 * @param {string} propertyKey
 * @returns {DecoratorParameters}
 */
function decoratorArgs(target, propertyKey) {
    return [target, propertyKey, ObjectUtils_1.descriptorOf(target, propertyKey)];
}
exports.decoratorArgs = decoratorArgs;
function decorateMethodsOf(klass, decorator) {
    ObjectUtils_1.methodsOf(klass).forEach(({ target, propertyKey }) => {
        if (target !== ObjectUtils_1.classOf(klass)) {
            Object.defineProperty(ObjectUtils_1.prototypeOf(klass), propertyKey, {
                value(...args) {
                    return ObjectUtils_1.prototypeOf(target)[propertyKey].apply(this, args);
                }
            });
        }
        decorator(ObjectUtils_1.prototypeOf(klass), propertyKey, ObjectUtils_1.descriptorOf(klass, propertyKey));
    });
}
exports.decorateMethodsOf = decorateMethodsOf;
function applyDecorators(...decorators) {
    return (...args) => {
        decorators
            .filter((o) => !!o)
            .forEach((decorator) => {
            decorator(...args);
        });
    };
}
exports.applyDecorators = applyDecorators;
//# sourceMappingURL=DecoratorUtils.js.map