"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
/**
 * Inject the ExpressRouter (Express.Router) instance.
 *
 * ### Example
 *
 * ```typescript
 * import {ExpressRouter, Service} from "@tsed/common";
 *
 * @Controller("/")
 * export default class OtherService {
 *    constructor(@ExpressRouter router: ExpressRouter) {}
 * }
 * ```
 *
 * @param {Type<any>} target
 * @param {string} targetKey
 * @param {TypedPropertyDescriptor<Function> | number} descriptor
 * @returns {any}
 * @decorator
 */
function ExpressRouter(target, targetKey, descriptor) {
    return di_1.Inject(ExpressRouter)(target, targetKey, descriptor);
}
exports.ExpressRouter = ExpressRouter;
//# sourceMappingURL=ExpressRouter.js.map