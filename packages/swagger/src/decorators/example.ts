import {Schema} from "@tsed/common";

/**
 * Add a example metadata on the decorated element.
 *
 * @param {string} name
 * @param {string} description
 * @returns {(...args: any[]) => any}
 * @decorator
 * @swagger
 * @jsonschema
 * @property
 */
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
