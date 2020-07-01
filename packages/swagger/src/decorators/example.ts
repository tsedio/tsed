import {Example as E} from "@tsed/schema";

/**
 * Add a example metadata on the decorated element.
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @methodDecorator
 * @deprecated Use @Example from @tsed/schema
 */
export function Example(examples: any): Function;
/**
 * Add a example metadata on the decorated element.
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @methodDecorator
 * @deprecated Use @Example from @tsed/schema
 */
export function Example(name: string, description: string): Function;
/**
 * Add a example metadata on the decorated element.
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @methodDecorator
 * @deprecated Use @Example from @tsed/schema
 */
export function Example(name: string | any, description?: string) {
  return E(name, description as any);
}
