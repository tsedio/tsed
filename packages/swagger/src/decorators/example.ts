import {Example as E} from "@tsed/common";

/**
 * Add a example metadata on the decorated element.
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @methodDecorator
 * @classDecorator
 * @ignore
 * @deprecated
 */
export function Example(example: any): Function;
export function Example(name: string, description: string): ClassDecorator;
export function Example(...args: any[]): Function {
  // @ts-ignore
  return E(...args);
}
