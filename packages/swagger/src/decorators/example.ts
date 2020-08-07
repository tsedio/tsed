import {Schema} from "@tsed/common";

/**
 * Add a example metadata on the decorated element.
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @methodDecorator
 * @classDecorator
 */
export function Example(examples: any): Function;
export function Example(name: string, description: string): Function;
export function Example(name: string | any, description?: string) {
  return (...args: any[]) => {
    let example;
    if (description) {
      example = {[name]: description};
    } else {
      example = name;
    }

    return Schema({example: example as any})(...args);
  };
}
