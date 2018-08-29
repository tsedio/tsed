import {getDecoratorType, Metadata, Store, UnsupportedDecoratorType} from "@tsed/core";

/**
 *
 * @param symbol
 * @returns {Function}
 * @decorator
 */
export function Inject(symbol?: any): Function {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function> | number): any => {
    const bindingType = getDecoratorType([target, propertyKey, descriptor], true);

    switch (bindingType) {
      case "parameter":
      case "parameter.constructor":
        if (symbol) {
          const paramTypes = Metadata.getParamTypes(target, propertyKey);

          paramTypes[descriptor as number] = symbol;
          Metadata.setParamTypes(target, propertyKey, paramTypes);
        }
        break;

      case "property":
        Store.from(target).merge("injectableProperties", {
          [propertyKey]: {
            bindingType,
            propertyKey,
            useType: symbol || Metadata.getType(target, propertyKey)
          }
        });
        break;

      case "method":
        Store.from(target).merge("injectableProperties", {
          [propertyKey]: {
            bindingType,
            propertyKey
          }
        });

        return descriptor;

      default:
        throw new UnsupportedDecoratorType(Inject, [target, propertyKey, descriptor]);
    }
  };
}
