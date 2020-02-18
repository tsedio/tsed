"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
/**
 * Inject the express application instance.
 *
 *
 * ```typescript
 * import {ExpressApplication, Service, Inject} from "@tsed/common";
 *
 * @Service()
 * export default class OtherService {
 *    constructor(@ExpressApplication expressApplication: Express.Application) {}
 * }
 * ```
 *
 * @param {Type<any>} target
 * @param {string} targetKey
 * @param {TypedPropertyDescriptor<Function> | number} descriptor
 * @returns {any}
 * @decorator
 */
function ExpressApplication(target, targetKey, descriptor) {
    return di_1.Inject(ExpressApplication)(target, targetKey, descriptor);
}
exports.ExpressApplication = ExpressApplication;
//# sourceMappingURL=expressApplication.js.map