import {deepMerge, useDecorators} from "@tsed/core";

import {JsonEntityFn} from "../decorators/common/jsonEntityFn.js";

export interface ErrorChainedMethods<T> {
  <T>(target: Object, propertyKey?: string | symbol | undefined, descriptor?: TypedPropertyDescriptor<T> | number): any;

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

      return useDecorators(
        decorator,
        schema.message &&
          JsonEntityFn((store) => {
            // since errorMessage is a custom key, it is prefixed with a # to avoid conflict with JSON Schema keywords
            const errorMessage = store.parentSchema.get("#errorMessage") || {};

            if (errorKey === "required") {
              store.parentSchema.customKey(
                "errorMessage",
                deepMerge(errorMessage, {
                  [errorKey]: {
                    [store.propertyName]: message
                  }
                })
              );
            } else {
              store.itemSchema.customKey(
                "errorMessage",
                deepMerge(errorMessage, {
                  [errorKey]: message
                })
              );
            }
          })
      );
    };

    return decorator;
  }) as any;
}
