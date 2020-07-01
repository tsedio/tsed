import {decoratorTypeOf, DecoratorTypes, isArray} from "@tsed/core";
import {Schema} from "./schema";

/**
 * Add a example metadata on the decorated element.
 *
 * @param {string} example
 * @decorator
 * @swagger
 * @schema
 * @methodDecorator
 * @classDecorator
 * @ignore
 * @deprecated Use @ExclusiveMaximum decorator from @tsed/schema instead of.
 */
export function Example(example: any): Function;
export function Example(name: string | any, description: string): ClassDecorator;
export function Example(...args: any[]): Function {
  const [name, description] = args;

  return (...args: any[]) => {
    const type = decoratorTypeOf(args);
    switch (type) {
      case DecoratorTypes.CLASS:
        return Schema({example: typeof name === "object" ? name : {[name]: description}})(...args);

      case DecoratorTypes.PARAM:
      case DecoratorTypes.PROP:
      case DecoratorTypes.METHOD:
        return Schema({
          examples: isArray(name) ? [name] : [].concat(name)
        })(...args);
    }
  };
}
