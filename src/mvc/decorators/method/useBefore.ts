/**
 * @module common/mvc
 */
/** */

import {Type} from "../../../core/interfaces/Type";
import {getDecoratorType} from "../../../core/utils";
import {ControllerRegistry} from "../../registries/ControllerRegistry";
import {EndpointRegistry} from "../../registries/EndpointRegistry";

/**
 * Use decorators.
 * @returns {function(any, any, any): *}
 * @param args
 * @decorator
 */
export function UseBefore(...args: any[]): Function {

    return <T>(target: Type<any>,
               targetKey?: string,
               descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {

        if (getDecoratorType([target, targetKey, descriptor]) === "method") {
            EndpointRegistry.useBefore(target, targetKey!, args);
            return descriptor;
        }

        ControllerRegistry.merge(target, {
            middlewares: {
                useBefore: args
            }
        });
    };
}