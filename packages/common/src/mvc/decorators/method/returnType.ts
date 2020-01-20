import {getDecoratorType, Type} from "@tsed/core";
import {EndpointRegistry} from "../../registries/EndpointRegistry";

/**
 * Define the returned type for the serialization.
 *
 * ```typescript
 * @Controller('/')
 * export class Ctrl {
 *
 *    @Get('/')
 *    @ReturnType(User)
 *    get(): Promise<User> { }
 * }
 *
 * ```
 *
 * @returns {Function}
 * @param type
 * @decorator
 * @endpoint
 */
export function ReturnType(type: Type<any> | any): Function {
  return <T>(target: Type<any>, targetKey?: string, descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    if (getDecoratorType([target, targetKey, descriptor]) === "method") {
      EndpointRegistry.get(target, targetKey!).type = type;

      return descriptor;
    }
  };
}
