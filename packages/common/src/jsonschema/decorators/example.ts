import {Example as E} from "@tsed/schema";

/**
 * Add a example metadata on the decorated element.
 *
 * @decorator
 * @swagger
 * @schema
 * @methodDecorator
 * @classDecorator
 * @ignore
 * @deprecated Since v6. Use @Example decorator from @tsed/schema instead of.
 * @param name
 * @param description
 */
export function Example(name: string | any, description: string): Function;
/**
 * @deprecated Since v6. Use @Example decorator from @tsed/schema instead of.
 */
export function Example(example: any): Function;
/**
 * @deprecated Since v6. Use @Example decorator from @tsed/schema instead of.
 */
export function Example(...args: any[]): Function {
  // @ts-ignore
  return E(...args);
}
