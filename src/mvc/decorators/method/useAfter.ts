/**
 * @module common/mvc
 */
/** */

import {Type} from "../../../core/interfaces/Type";
import {ControllerRegistry} from "../../registries/ControllerRegistry";
import {EndpointRegistry} from "../../registries/EndpointRegistry";
import {getDecoratorType} from "../../../core/utils";

/**
 * Use decorators.
 * @returns {function(any, any, any): *}
 * @param args
 * @decorator
 */
export function UseAfter(...args: any[]): Function {

    return <T>(target: Type<any>,
               targetKey?: string,
               descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {

        if (getDecoratorType([target, targetKey, descriptor]) === "method") {
            EndpointRegistry.useAfter(target, targetKey!, args);
            return descriptor;
        }

        ControllerRegistry.merge(target, {
            middlewares: {
                useAfter: args
            }
        });
    };
}