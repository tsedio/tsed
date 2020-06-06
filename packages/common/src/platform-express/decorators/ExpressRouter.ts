import {Type} from "@tsed/core";
import {Inject} from "@tsed/di";
import * as Express from "express";

/**
 *
 */
export type ExpressRouter = Express.Router & {
  (target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number): any;
};

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
 * @deprecated Use PlatformRouter instead of.
 */
export function ExpressRouter(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number) {
  return Inject(ExpressRouter)(target, targetKey, descriptor);
}
