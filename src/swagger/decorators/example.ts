import {Schema} from "./schema";

/**
 * Add a example metadata on the decorated element.
 *
 * @param {string} name
 * @param {string} description
 * @returns {(...args: any[]) => any}
 * @decorator
 */
export function Example(name: string, description?: string) {
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

/**
 * Add a example metadata of any type on the decorated element.
 *
 * @param {any} exampleValue
 * @returns {(...args: any[]) => any}
 * @decorator
 */
export function ExampleAnyType(exampleValue: any, ) {
    return (...args: any[]) => {
        return Schema({example: exampleValue})(...args);
    };
}