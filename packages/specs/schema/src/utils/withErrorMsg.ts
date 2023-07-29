import {useDecorators} from "@tsed/core";
import {ErrorMsg} from "../decorators/common/errorMsg";

export interface ErrorChainedMethods<T> {
  <T>(target: Object, propertyKey: string | symbol | undefined, descriptor?: TypedPropertyDescriptor<T> | number): any;

  Error(msg: string): this;
}

export type ErrorChainedDecorator<Decorator extends (...args: any[]) => any> = (
  ...args: Parameters<Decorator>
) => ErrorChainedMethods<Decorator>;

export function withErrorMsg<Decorator extends (...args: any[]) => any>(
  errorKey: string,
  originalDecorator: Decorator
): ErrorChainedDecorator<Decorator> {
  const schema: any = {};

  return ((...decoratorOptions: any[]) => {
    const decorator = useDecorators(originalDecorator(...decoratorOptions));
    (decorator as any).Error = (message: string) => {
      schema.message = message;
      return useDecorators(decorator, schema.message && ErrorMsg({[errorKey]: message}));
    };

    return decorator;
  }) as any;
}
