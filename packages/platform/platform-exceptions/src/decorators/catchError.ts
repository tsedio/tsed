import {Type} from "@tsed/core";
import {Intercept} from "@tsed/di";
import {CatchErrorInterceptor} from "../interceptors/CatchErrorInterceptor";
import {CatchErrorMethods} from "../interfaces/CatchErrorMethods";

/**
 * Use a custom CatchError provider to catch exception on a method/class.
 * @decorator
 */
export function CatchError(catcher: Type<CatchErrorMethods>): MethodDecorator | ClassDecorator {
  return Intercept(CatchErrorInterceptor, {
    catcher
  });
}
