/**
 * @module common/mvc
 */
/** */
import {Type} from "../../../core/interfaces/Type";
import {getDecoratorType} from "../../../core/utils";
import {ControllerRegistry} from "../../registries/ControllerRegistry";
import {EndpointRegistry} from "../../registries/EndpointRegistry";

/**
 * Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
 * the base of the requested path matches `path.
 *
 * ```typescript
 * @Controller('/')
 * @Use(Middleware1)
 * export class Ctrl {
 *
 *    @Get('/')
 *    @Use(Middleware2)
 *    get() { }
 * }
 *
 * ```
 *
 * @returns {Function}
 * @param args
 * @decorator
 */
export function Use(...args: any[]): Function {

    return <T>(target: Type<any>,
               targetKey?: string,
               descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {

        if (getDecoratorType([target, targetKey, descriptor]) === "method") {
            EndpointRegistry.use(target, targetKey!, args);
            return descriptor;
        }

        ControllerRegistry.merge(target, {
            middlewares: {
                use: args
            }
        });
    };
}