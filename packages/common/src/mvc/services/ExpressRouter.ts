import {Type} from "@tsed/core";
import * as Express from "express";
import {Inject} from "@tsed/di";

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
 */
export function ExpressRouter(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number) {
  return Inject(ExpressRouter)(target, targetKey, descriptor);
}
