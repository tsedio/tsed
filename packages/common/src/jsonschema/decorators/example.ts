import {Schema} from "./schema";

/**
 * Add a example metadata on the decorated element.
 *
 * @param {string} name
 * @param {string} description
 * @decorator
 * @swagger
 * @schema
 * @methodDecorator
 * @classDecorator
 */
export function Example(name: string | any, description?: string) {
  let example: any;

  if (description) {
    example = {[name]: description};
  } else {
    example = name;
    if (typeof name === "string") {
      example = [].concat(example);
    }
  }

  return (...args: any[]) => {
    return Schema({examples: example as any})(...args);
  };
}
